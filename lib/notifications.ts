import { Resend } from 'resend';

/**
 * L'envoi des notifications que l'agence reçoit quand un formulaire est
 * soumis, et le seul endroit où Resend est appelé.
 *
 * Les deux formulaires du site empruntent ce chemin : /demarrer-un-projet
 * via /api/send-notification, et les fiches solution directement depuis
 * /api/solution-requests. Ils partageaient déjà l'échappement et la
 * gestion de la clé absente — à deux exemplaires, ce qui garantissait
 * qu'une correction n'en atteindrait qu'un.
 */

/** Le seul destinataire : c'est une alerte interne, pas un envoi en masse. */
const RECIPIENT = 'contact@nassflow.com';

/**
 * Échappe une valeur avant de l'insérer dans le corps HTML de l'e-mail :
 * sans cela, un visiteur peut placer ses propres balises et liens dans
 * la notification que nous recevons.
 */
export function esc(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Réduit une valeur à une ligne, pour un objet d'e-mail : un retour
 * chariot injecté dans un en-tête permettrait d'en forger d'autres.
 */
export function oneLine(value: unknown, fallback: string): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim() || fallback;
}

export type NotificationResult =
  | { ok: true }
  | { ok: false; reason: 'missing-key' | 'send-failed'; message: string };

/**
 * Envoie la notification. Ne lève jamais : l'appelant décide de ce qu'un
 * échec signifie pour lui, et dans les deux cas la demande est déjà
 * enregistrée en base au moment où on arrive ici.
 *
 * Rien de ce qui est journalisé ne contient la clé d'API : seuls le nom
 * et le message de l'erreur renvoyée par Resend en sortent.
 */
export async function sendAgencyNotification({
  subject,
  html,
  replyTo,
}: {
  subject: string;
  html: string;
  replyTo?: string | null;
}): Promise<NotificationResult> {
  // Lue à l'appel et non au chargement du module : une clé absente ne
  // doit pas faire échouer la collecte des routes pendant `next build`.
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      reason: 'missing-key',
      message: 'RESEND_API_KEY absente.',
    };
  }

  // `onboarding@resend.dev` est le domaine bac à sable de Resend : il
  // n'a ni SPF ni DKIM au nom de nassflow.com. Une fois le domaine
  // vérifié dans Resend, renseigner RESEND_FROM et les notifications
  // cesseront de partir en spam.
  const from = process.env.RESEND_FROM ?? 'NASSFLOW <onboarding@resend.dev>';

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: [RECIPIENT],
      subject,
      html,
      ...(typeof replyTo === 'string' && replyTo.includes('@')
        ? { replyTo }
        : {}),
    });

    if (error) {
      return {
        ok: false,
        reason: 'send-failed',
        message: `${error.name ?? 'Erreur'} : ${error.message ?? ''}`.trim(),
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: 'send-failed',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
