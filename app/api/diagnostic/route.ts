import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { sendAgencyNotification } from '@/lib/notifications';
import { readSubmission } from '@/lib/diagnostic/validate';
import { buildEmail, buildRow } from '@/lib/diagnostic/record';

/**
 * Le formulaire de diagnostic (/demarrer-un-projet).
 *
 * L'insertion se fait ici, avec la clé service_role, et non plus depuis
 * le navigateur : la demande est revalidée intégralement (listes
 * fermées, longueurs, e-mail), et la table n'a plus besoin d'accepter
 * les écritures publiques.
 *
 * Anti-robots : un champ piège (`reference`), et un délai minimal entre
 * l'affichage du formulaire et l'envoi (lib/diagnostic/validate.ts).
 *
 * Double envoi : l'identifiant tiré par le navigateur est unique en base
 * (index `project_requests_submission_id_key`). Un envoi rejoué — double
 * clic, réponse perdue puis nouvel essai — tombe sur ce doublon et reçoit
 * la même réponse que le premier, sans seconde ligne ni second e-mail.
 *
 * Journal : le statut et la durée, jamais une donnée personnelle — ni
 * l'erreur Supabase complète, dont le détail peut citer une valeur.
 */

export const dynamic = 'force-dynamic';

/** Le formulaire pèse quelques kilo-octets ; au-delà, ce n'est pas lui. */
const MAX_BODY_BYTES = 20_000;

/** Code Postgres d'une violation d'unicité. */
const UNIQUE_VIOLATION = '23505';

function respond(started: number, status: number, outcome: string, body: object) {
  console.info(`diagnostic ${status} ${outcome} ${Math.round(performance.now() - started)}ms`);

  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const started = performance.now();

  let body: unknown;

  try {
    const text = await request.text();

    if (text.length > MAX_BODY_BYTES) {
      return respond(started, 413, 'trop-long', { error: 'Requête trop volumineuse.' });
    }

    body = JSON.parse(text);
  } catch {
    return respond(started, 400, 'illisible', { error: 'Requête illisible.' });
  }

  const submission = readSubmission(body);

  // On répond comme à un envoi réussi : un refus explicite apprendrait
  // au robot à éviter le piège.
  if (submission.kind === 'bot') {
    return respond(started, 201, 'piege', { ok: true });
  }

  if (submission.kind === 'too-fast') {
    return respond(started, 400, 'trop-rapide', {
      error: 'Envoi trop rapide. Relisez vos réponses puis renvoyez le formulaire.',
    });
  }

  if (submission.kind === 'invalid') {
    return respond(started, 400, 'invalide', {
      error: submission.error,
      ...(submission.field ? { field: submission.field } : {}),
    });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return respond(started, 503, 'sans-cle', {
      error: 'Service d’enregistrement indisponible.',
    });
  }

  const now = new Date();
  const { request: diagnostic, submissionId } = submission;

  const { error: insertError } = await supabase
    .from('project_requests')
    .insert(buildRow(diagnostic, submissionId, now));

  if (insertError) {
    if (insertError.code === UNIQUE_VIOLATION) {
      return respond(started, 201, 'doublon', { ok: true });
    }

    return respond(started, 500, `insertion-${insertError.code ?? 'inconnue'}`, {
      error: 'L’enregistrement de la demande a échoué.',
    });
  }

  // La ligne est écrite : l'e-mail ne peut plus faire échouer la demande.
  const notification = await sendAgencyNotification(buildEmail(diagnostic, now));

  return respond(started, 201, notification.ok ? 'ok' : `ok-sans-email-${notification.reason}`, {
    ok: true,
  });
}
