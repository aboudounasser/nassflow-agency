import { buildDemoRequest, readDemoBody, readDemoResponse } from '@/lib/demo/analysis';

/**
 * La démonstration interactive de l'accueil (components/demo/) : un
 * texte de prospect et son canal (WhatsApp, e-mail, formulaire) entrent,
 * une fiche structurée sort.
 *
 * La route vit sous /api/chat exprès : la règle de pare-feu Vercel qui
 * limite l'assistant (10 requêtes par minute et par IP) la couvre aussi.
 * Les deux partagent ce quota, c'est voulu.
 *
 * Rien n'est écrit en base, aucun e-mail ne part, et le texte du
 * visiteur n'est jamais journalisé : seulement sa longueur, le statut
 * et la durée. La clé OpenAI ne sort pas du serveur (voir la route de
 * l'assistant).
 *
 * Pas de flux : la fiche n'a de sens qu'entière, et c'est le schéma
 * vérifié qui part au navigateur, pas le texte brut du modèle.
 */

export const dynamic = 'force-dynamic';

/** Au-delà, mieux vaut un message d'erreur qu'un visiteur qui attend. */
const TIMEOUT_MS = 20_000;

function log(status: number, length: number, started: number) {
  console.info(
    JSON.stringify({
      route: 'demo',
      status,
      length,
      durationMs: Math.round(performance.now() - started),
    }),
  );
}

export async function POST(request: Request) {
  const started = performance.now();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    log(400, 0, started);

    return Response.json({ error: 'Requête illisible.' }, { status: 400 });
  }

  const input = readDemoBody(body);
  const raw = (body as { text?: unknown } | null)?.text;
  const length = typeof raw === 'string' ? raw.trim().length : 0;

  if ('error' in input) {
    log(400, length, started);

    return Response.json({ error: input.error }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY absente : démonstration indisponible.');
    log(503, length, started);

    return Response.json({ error: 'unavailable' }, { status: 503 });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildDemoRequest(input.text, input.channel)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!upstream.ok) {
      // Seulement le code d'erreur d'OpenAI : son message peut citer la
      // requête, donc le texte du visiteur.
      const detail = await upstream.json().catch(() => null);

      console.error(
        `Démonstration : le modèle a répondu ${upstream.status} —`,
        detail?.error?.code ?? detail?.error?.type ?? 'sans code',
      );
      log(502, length, started);

      return Response.json({ error: 'unavailable' }, { status: 502 });
    }

    const analysis = readDemoResponse(await upstream.json(), input.channel);

    if (!analysis) {
      console.error('Démonstration : réponse du modèle non conforme au schéma.');
      log(502, length, started);

      return Response.json({ error: 'unavailable' }, { status: 502 });
    }

    log(200, length, started);

    return Response.json(analysis, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error(
      'Démonstration : appel au modèle impossible —',
      error instanceof Error ? error.name : 'erreur inconnue',
    );
    log(502, length, started);

    return Response.json({ error: 'unavailable' }, { status: 502 });
  }
}
