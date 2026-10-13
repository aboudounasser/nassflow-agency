import { timingSafeEqual } from 'node:crypto';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

/**
 * Garde le projet Supabase éveillé.
 *
 * Sur le plan gratuit, un projet sans activité pendant quelques jours se
 * met en pause : son domaine ne répond plus, et les formulaires du site
 * tombent en 500 sans que personne ne s'en aperçoive. Vercel Cron appelle
 * cette route une fois par jour (vercel.json) ; une lecture suffit à
 * compter comme une activité.
 *
 * La lecture est la plus légère possible : `head: true` exécute la
 * requête sans renvoyer de ligne. Elle vise `chat_leads`, la seule
 * table où la lecture par `service_role` est accordée explicitement
 * (`grant select`, supabase/chat_leads.sql) ; `project_requests` la lui
 * refuse (42501) : seul le navigateur y écrit. La route ne renvoie aucune donnée, et jamais le détail d'une
 * erreur — seulement `{ ok }`.
 *
 * Seul Vercel Cron peut l'appeler : il envoie `Authorization: Bearer
 * <CRON_SECRET>` quand la variable est définie sur le projet. Sans
 * CRON_SECRET, la route refuse tout : un secret absent ne doit jamais
 * ouvrir la porte.
 */

const headers = {
  // Une route technique : rien à indexer, rien à mettre en cache.
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
};

/** Compare sans fuite de temps : la durée ne dit rien du secret. */
function isAuthorized(received: string | null, secret: string | undefined) {
  if (!secret || !received) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(received);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function GET(request: Request) {
  if (!isAuthorized(request.headers.get('authorization'), process.env.CRON_SECRET)) {
    return Response.json({ ok: false }, { status: 401, headers });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    console.error('Keepalive : variables Supabase absentes.');
    return Response.json({ ok: false }, { status: 500, headers });
  }

  const { error, status } = await supabase
    .from('chat_leads')
    .select('id', { head: true })
    .limit(1);

  if (error) {
    // Une requête HEAD n'a pas de corps : le message est souvent vide,
    // le statut HTTP dit l'essentiel.
    console.error('Keepalive : lecture Supabase en échec.', status, error.code ?? '');
    return Response.json({ ok: false }, { status: 500, headers });
  }

  return Response.json({ ok: true }, { headers });
}
