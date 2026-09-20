import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { esc, sendAgencyNotification } from '@/lib/notifications';

/**
 * Le passage de relais : le visiteur a discuté avec l'assistant et veut
 * qu'on le rappelle.
 *
 * C'est le seul endroit où une conversation est conservée, et seulement
 * parce que le visiteur l'a demandé en laissant son adresse. Sans ce
 * geste, rien de ce qu'il écrit à l'assistant ne quitte son onglet.
 *
 * La conversation est jointe telle qu'elle s'est déroulée : sans elle,
 * on rappellerait quelqu'un dont on ignore de quoi il a parlé, et on lui
 * ferait tout répéter.
 */

const MAX_EMAIL = 320;
const MAX_FIRST_NAME = 100;
const MAX_NEED = 1000;
const MAX_TRANSCRIPT_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 1000;
const MAX_PAGE = 300;

type Message = { role: 'user' | 'assistant'; content: string };

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  // On ne tronque pas : une valeur trop longue est un signe que quelque
  // chose ne va pas, pas une valeur à réparer en silence.
  if (trimmed.length === 0 || trimmed.length > max) return null;

  return trimmed;
}

/** Contrôle de forme, pas de validité : seul un envoi le prouverait. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * La conversation, revalidée intégralement.
 *
 * Elle arrive du navigateur, qui peut donc inventer des rôles ou
 * rallonger les messages. On rejette au lieu de filtrer : un transcript
 * partiellement retenu serait un compte rendu faux, joint à un e-mail
 * qu'on lira comme s'il était complet.
 */
function readTranscript(value: unknown): Message[] | { error: string } {
  if (value === undefined || value === null) return [];

  if (!Array.isArray(value)) return { error: 'Conversation illisible.' };

  if (value.length > MAX_TRANSCRIPT_MESSAGES) {
    return { error: 'Conversation trop longue.' };
  }

  const messages: Message[] = [];

  for (const item of value) {
    if (typeof item !== 'object' || item === null) {
      return { error: 'Conversation illisible.' };
    }

    const { role, content } = item as Record<string, unknown>;

    if (role !== 'user' && role !== 'assistant') {
      return { error: 'Conversation illisible.' };
    }

    if (typeof content !== 'string') {
      return { error: 'Conversation illisible.' };
    }

    if (content.length > MAX_MESSAGE_CHARS) {
      return { error: 'Un message de la conversation est trop long.' };
    }

    messages.push({ role, content });
  }

  return messages;
}

function buildEmail(
  lead: {
    email: string;
    first_name: string | null;
    need: string | null;
    page: string | null;
  },
  transcript: Message[],
): string {
  const echanges =
    transcript.length === 0
      ? '<p>Aucun échange : la demande a été déposée avant de discuter.</p>'
      : transcript
          .map(
            (message) =>
              `<p><strong>${message.role === 'user' ? 'Visiteur' : 'Assistant'} :</strong><br />${esc(
                message.content,
              )}</p>`,
          )
          .join('\n        ');

  return `
        <h2>Nouvelle demande via l'assistant</h2>

        <h3>👤 Contact</h3>
        <p><strong>Email :</strong> ${esc(lead.email)}</p>
        <p><strong>Prénom :</strong> ${esc(lead.first_name)}</p>
        <p><strong>Son besoin :</strong> ${esc(lead.need)}</p>
        <p><strong>Page d'origine :</strong> ${esc(lead.page)}</p>

        <h3>💬 La conversation</h3>
        ${echanges}
      `;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest('Requête illisible.');
  }

  const payload =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  /**
   * Le champ piège. Invisible pour un visiteur, il n'est rempli que par
   * un robot qui remplit tout ce qu'il trouve. On répond 201 comme si de
   * rien n'était : un refus explicite lui apprendrait à l'éviter.
   */
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return Response.json({ ok: true }, { status: 201 });
  }

  const email = cleanString(payload.email, MAX_EMAIL);

  if (!email || !looksLikeEmail(email)) {
    return badRequest('Une adresse e-mail valide est nécessaire.');
  }

  if (payload.first_name !== undefined && payload.first_name !== null) {
    if (typeof payload.first_name !== 'string') {
      return badRequest('Prénom illisible.');
    }

    if (payload.first_name.trim().length > MAX_FIRST_NAME) {
      return badRequest('Prénom trop long.');
    }
  }

  if (payload.need !== undefined && payload.need !== null) {
    if (typeof payload.need !== 'string') {
      return badRequest('Besoin illisible.');
    }

    if (payload.need.trim().length > MAX_NEED) {
      return badRequest('Votre message est trop long.');
    }
  }

  const transcript = readTranscript(payload.transcript);

  if ('error' in transcript) return badRequest(transcript.error);

  const lead = {
    email,
    first_name: cleanString(payload.first_name, MAX_FIRST_NAME),
    need: cleanString(payload.need, MAX_NEED),
    page: cleanString(payload.page, MAX_PAGE),
  };

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    console.error(
      'SUPABASE_SERVICE_ROLE_KEY absente : demande de rappel non enregistrée.',
    );

    return Response.json(
      { error: 'Service d’enregistrement indisponible.' },
      { status: 503 },
    );
  }

  const { error: insertError } = await supabase
    .from('chat_leads')
    .insert({ ...lead, transcript });

  if (insertError) {
    console.error('Supabase insert error (chat_leads):', insertError);

    return Response.json(
      { error: 'L’enregistrement de la demande a échoué.' },
      { status: 500 },
    );
  }

  // La ligne est écrite : plus rien ne peut faire échouer la demande.
  const notification = await sendAgencyNotification({
    subject: "Nouvelle demande via l'assistant",
    html: buildEmail(lead, transcript),
    replyTo: lead.email,
  });

  if (!notification.ok) {
    console.error(
      `Notification de rappel non envoyée (${notification.reason}) :`,
      notification.message,
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
