import {
  assistantUnavailableMessage,
  systemInstructions,
} from '@/lib/assistant/instructions';

/**
 * L'assistant IA du site.
 *
 * Tout se passe ici, côté serveur : `OPENAI_API_KEY` n'est pas préfixée
 * `NEXT_PUBLIC_`, elle ne peut donc pas entrer dans le bundle du
 * navigateur — et cette route est le seul endroit qui la lit.
 *
 * Aucune conversation n'est enregistrée : l'historique vit dans l'onglet
 * du visiteur, qui le renvoie à chaque message. C'est aussi pourquoi il
 * est revalidé ici à chaque fois — le navigateur peut mentir sur son
 * contenu comme sur sa longueur.
 */

/**
 * Le modèle, en une constante : c'est la seule ligne à changer pour en
 * essayer un autre.
 *
 * `gpt-5.6-luna` est le palier rapide et économique de la famille
 * GPT-5.6 (0,20 $ / MTok en entrée, 1,20 $ en sortie). Répondre à des
 * questions sur six solutions, à partir d'un contexte fourni, ne
 * demande pas un modèle de raisonnement : ce qui compte ici est le
 * temps de première réponse et le coût par visiteur.
 */
const MODEL = 'gpt-5.6-luna';

/** Au-delà, ce n'est plus une question mais un collage. */
const MAX_MESSAGE_CHARS = 1000;

/** Vingt échanges : de quoi tenir une conversation, pas une archive. */
const MAX_HISTORY_MESSAGES = 40;

/** Quatre phrases demandées ; ce plafond n'est qu'un garde-fou de coût. */
const MAX_OUTPUT_TOKENS = 400;

/** L'assistant répond en flux ; la route ne doit pas être mise en cache. */
export const dynamic = 'force-dynamic';

type Message = { role: 'user' | 'assistant'; content: string };

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

/**
 * Ne garde que ce qui a la forme d'un message, et rejette dès qu'un
 * élément est trop long. On ne tronque pas silencieusement : un
 * visiteur dont la question est coupée en plein milieu recevrait une
 * réponse à côté sans comprendre pourquoi.
 */
function readMessages(value: unknown): Message[] | { error: string } {
  if (!Array.isArray(value)) return { error: 'Conversation illisible.' };

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

    const trimmed = content.trim();

    if (trimmed.length === 0) continue;

    if (trimmed.length > MAX_MESSAGE_CHARS) {
      return {
        error: `Votre message dépasse ${MAX_MESSAGE_CHARS} caractères. Résumez-le, ou écrivez-nous directement.`,
      };
    }

    messages.push({ role, content: trimmed });
  }

  if (messages.length === 0) return { error: 'Message vide.' };

  if (messages[messages.length - 1].role !== 'user') {
    return { error: 'Le dernier message doit venir du visiteur.' };
  }

  // Les plus anciens partent en premier : c'est la fin de la
  // conversation qui porte le sens.
  return messages.slice(-MAX_HISTORY_MESSAGES);
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY absente : assistant indisponible.');

    return Response.json(
      { error: assistantUnavailableMessage },
      { status: 503 },
    );
  }

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

  const result = readMessages(payload.messages);

  if ('error' in result) return badRequest(result.error);

  let upstream: Response;

  try {
    upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: systemInstructions,
        input: result,
        max_output_tokens: MAX_OUTPUT_TOKENS,
        // `store` vaut `true` par défaut : sans cette ligne, chaque
        // échange resterait consultable dans le tableau de bord OpenAI
        // pendant trente jours. On dit au visiteur qu'on ne garde pas sa
        // conversation ; la garder ailleurs reviendrait au même.
        // L'historique nous revient du navigateur à chaque message, on
        // n'a donc rien à faire conserver.
        store: false,
        stream: true,
      }),
    });
  } catch (error) {
    // Le message de l'erreur réseau, jamais l'en-tête qui portait la clé.
    console.error(
      'Assistant : appel au modèle impossible —',
      error instanceof Error ? error.message : String(error),
    );

    return Response.json(
      { error: assistantUnavailableMessage },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    // Le corps d'erreur d'OpenAI décrit la requête refusée ; il ne
    // contient pas la clé, qui voyage dans l'en-tête Authorization.
    const detail = await upstream.text().catch(() => '');

    console.error(
      `Assistant : le modèle a répondu ${upstream.status} —`,
      detail.slice(0, 500),
    );

    return Response.json(
      { error: assistantUnavailableMessage },
      { status: 502 },
    );
  }

  /**
   * On ne relaie pas le flux d'OpenAI tel quel : il porte le nom du
   * modèle, les compteurs de jetons et la forme de nos requêtes, que le
   * navigateur n'a pas à connaître. On n'en ressort que le texte.
   */
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      let buffer = '';

      try {
        for (;;) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Les événements SSE sont séparés par une ligne vide.
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const event of events) {
            for (const line of event.split('\n')) {
              if (!line.startsWith('data:')) continue;

              const data = line.slice(5).trim();

              if (data === '' || data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);

                if (
                  parsed.type === 'response.output_text.delta' &&
                  typeof parsed.delta === 'string'
                ) {
                  controller.enqueue(encoder.encode(parsed.delta));
                }
              } catch {
                // Un fragment illisible ne doit pas couper la réponse en
                // cours : le suivant arrive.
              }
            }
          }
        }
      } catch (error) {
        console.error(
          'Assistant : flux interrompu —',
          error instanceof Error ? error.message : String(error),
        );
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
