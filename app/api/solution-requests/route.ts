import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { solutions, type Solution } from '@/lib/content/solutions';

/**
 * Réception d'une demande déposée depuis une fiche solution.
 *
 * Pourquoi une route serveur plutôt qu'un insert depuis le navigateur,
 * comme le font ContactForm et ProjectForm : la table
 * `solution_requests` a RLS activée sans aucune policy, donc `anon` ne
 * peut ni lire ni écrire. Seule la clé `service_role` contourne RLS, et
 * elle ne peut pas quitter le serveur — un visiteur qui la récupérerait
 * lirait les coordonnées déposées par tous les autres. C'est ici, et
 * seulement ici, qu'on peut aussi valider ce qui est envoyé : le
 * navigateur peut mentir sur le slug comme sur les champs obligatoires.
 */

/** Garde-fous de taille : une valeur plus longue est tronquée. */
const MAX_FIELD = 2000;

function cleanString(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim().slice(0, MAX_FIELD);

  return trimmed.length > 0 ? trimmed : null;
}

/** Contrôle de forme, pas de validité : seul un envoi le prouverait. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Ne retient que les réponses aux questions réellement posées par cette
 * solution, clées par `question.id`. Tout champ surnuméraire envoyé par
 * le client est ignoré : `answers` reflète le catalogue, pas le
 * formulaire tel qu'il est arrivé.
 */
function buildAnswers(
  solution: Solution,
  received: unknown,
): { answers: Record<string, string>; missing: string[] } {
  const source =
    typeof received === 'object' && received !== null
      ? (received as Record<string, unknown>)
      : {};

  const answers: Record<string, string> = {};
  const missing: string[] = [];

  for (const question of solution.questions) {
    const value = cleanString(source[question.id]);

    if (value === null) {
      if (question.required) missing.push(question.id);
      continue;
    }

    // Un select ne peut renvoyer qu'une de ses options : sinon la valeur
    // est écartée, et traitée comme absente si la question est requise.
    if (question.type === 'select' && !question.options?.includes(value)) {
      if (question.required) missing.push(question.id);
      continue;
    }

    answers[question.id] = value;
  }

  return { answers, missing };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Requête illisible.' }, { status: 400 });
  }

  const payload =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const slug = cleanString(payload.solution_slug);
  const solution = solutions.find((item) => item.slug === slug);

  if (!solution) {
    return Response.json(
      { error: 'Cette solution n’existe pas dans le catalogue.' },
      { status: 400 },
    );
  }

  const email = cleanString(payload.email);

  if (!email || !looksLikeEmail(email)) {
    return Response.json(
      { error: 'Une adresse e-mail valide est nécessaire.' },
      { status: 400 },
    );
  }

  const { answers, missing } = buildAnswers(solution, payload.answers);

  if (missing.length > 0) {
    return Response.json(
      { error: 'Des questions obligatoires sont sans réponse.', missing },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    console.error(
      'SUPABASE_SERVICE_ROLE_KEY absente : demande de solution non enregistrée.',
    );

    return Response.json(
      { error: 'Service d’enregistrement indisponible.' },
      { status: 503 },
    );
  }

  const { error: insertError } = await supabase
    .from('solution_requests')
    .insert({
      solution_slug: solution.slug,
      company: cleanString(payload.company),
      contact_name: cleanString(payload.contact_name),
      email,
      phone: cleanString(payload.phone),
      sector: cleanString(payload.sector),
      answers,
      // La page d'où part la demande, reconstruite ici plutôt que reprise
      // du client : c'est une donnée de traçabilité, elle ne doit pas
      // dépendre de ce que le navigateur déclare.
      source: `/solutions/${solution.slug}`,
    });

  if (insertError) {
    console.error('Supabase insert error (solution_requests):', insertError);

    return Response.json(
      { error: 'L’enregistrement de la demande a échoué.' },
      { status: 500 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
