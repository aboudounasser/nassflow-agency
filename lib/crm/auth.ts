/**
 * L'accès au CRM : une authentification HTTP Basic, vérifiée à trois
 * endroits — proxy.ts (qui affiche la demande d'identifiants), la page
 * et chaque Server Action. Le proxy seul ne suffit pas : une Server
 * Action se joint par un POST direct, et un matcher modifié ou une
 * action déplacée retirerait la protection sans bruit.
 *
 * - `CRM_PASSWORD` définie : identifiant (`CRM_USER`, « nassflow » par
 *   défaut) et mot de passe exigés, en local comme en production.
 * - `CRM_PASSWORD` absente : le CRM n'existe qu'en développement ; en
 *   production il répond 404, comme /dev/motion. Un CRM ouvert à tous
 *   exposerait les coordonnées de chaque prospect.
 *
 * Ce module n'importe rien de Node : le proxy et les tests l'utilisent
 * tels quels.
 */

export type CrmAccess = 'granted' | 'challenge' | 'disabled';

type Env = Record<string, string | undefined>;

export const CRM_REALM = 'NASSFLOW CRM';

/** Comparaison en temps constant : la durée ne trahit pas le préfixe juste. */
function safeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;

  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }

  return diff === 0;
}

function decodeBasic(header: string | null): { user: string; password: string } | null {
  const match = /^Basic\s+([A-Za-z0-9+/=]+)$/i.exec(header?.trim() ?? '');

  if (!match) return null;

  let decoded: string;

  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(match[1]), (char) => char.charCodeAt(0)));
  } catch {
    return null;
  }

  const separator = decoded.indexOf(':');

  if (separator < 0) return null;

  return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
}

export function checkCrmAccess(authorization: string | null, env: Env = process.env): CrmAccess {
  const password = env.CRM_PASSWORD;

  if (!password) return env.NODE_ENV === 'production' ? 'disabled' : 'granted';

  const credentials = decodeBasic(authorization);

  if (!credentials) return 'challenge';

  const userOk = safeEqual(credentials.user, env.CRM_USER || 'nassflow');
  const passwordOk = safeEqual(credentials.password, password);

  return userOk && passwordOk ? 'granted' : 'challenge';
}
