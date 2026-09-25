import { Fragment, type ReactNode } from 'react';
import { BOOKING_URL } from '@/lib/content/contact';
import { TextLink } from '@/components/ui/TextLink';

/**
 * Transforme en liens les seules URL qu'on accepte d'afficher, et rend
 * tout le reste en texte.
 *
 * C'est le point sensible de l'interface : la réponse vient d'un modèle,
 * donc d'un texte qu'un visiteur peut en partie influencer. Elle n'est
 * jamais interprétée comme du HTML ni comme du Markdown — pas de
 * `dangerouslySetInnerHTML` ici ni ailleurs. On repère les URL, on
 * vérifie leur hôte, et on ne fabrique un lien que pour nassflow.com et
 * pour l'adresse de réservation. Une URL vers autre chose reste du
 * texte : visible, mais pas cliquable.
 *
 * Ce qui s'affiche n'est pas l'adresse brute. Une URL de réservation
 * devient « réserver un appel », comme dans le message d'accueil ; une
 * page du site s'affiche sous son chemin court. Le `href`, lui, reste
 * l'URL complète : c'est ce qui s'ouvre, et c'est ce qu'on a vérifié.
 */

const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/g;

/** L'hôte de réservation, dérivé de la constante plutôt que réécrit. */
const bookingHost = new URL(BOOKING_URL).hostname.toLowerCase();

type Allowed = { kind: 'booking' | 'site'; label: string };

/**
 * Décide si une adresse est affichable, et sous quel libellé.
 *
 * Renvoyer `null` plutôt qu'un booléen évite d'analyser l'URL deux
 * fois, et surtout garantit qu'aucun libellé ne peut être fabriqué pour
 * une adresse qu'on n'a pas autorisée.
 */
function classify(raw: string): Allowed | null {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.toLowerCase();

  if (host === bookingHost) {
    return { kind: 'booking', label: 'réserver un appel' };
  }

  // `endsWith('.nassflow.com')` et non `includes` : « nassflow.com.ru »
  // passerait le second.
  if (host === 'nassflow.com' || host.endsWith('.nassflow.com')) {
    // Le chemin court, tel qu'on le dirait à voix haute : sans le
    // protocole, sans le « www. », sans la barre finale.
    const path = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');

    return {
      kind: 'site',
      label: `${host.replace(/^www\./, '')}${path}`,
    };
  }

  return null;
}

export function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  URL_PATTERN.lastIndex = 0;

  while ((match = URL_PATTERN.exec(text)) !== null) {
    const raw = match[0];

    // La ponctuation finale appartient à la phrase, pas à l'adresse.
    const trimmed = raw.replace(/[.,;:!?»]+$/, '');
    const start = match.index;
    const allowed = classify(trimmed);

    let before = text.slice(last, start);
    let skipAfter = 0;
    let label = allowed?.label;

    /**
     * Le modèle écrit souvent l'adresse entre parenthèses, derrière les
     * mots qu'elle sert : « réservez un appel (https://…) ». Affichée
     * sous son libellé, elle les répéterait — « réservez un appel
     * réserver un appel ». On retire donc les parenthèses, qui
     * n'encadrent plus rien, et quand la phrase dit déjà l'invitation,
     * c'est elle qui devient le lien plutôt que d'en recevoir un
     * deuxième à côté.
     */
    if (allowed) {
      const parenthesee =
        before.endsWith('(') && text[start + raw.length] === ')';

      // Les deux façons dont le modèle amène l'adresse : entre
      // parenthèses, ou après un deux-points.
      const amorce = parenthesee
        ? before.slice(0, -1)
        : before.replace(/\s*:\s*$/, '');

      const invitation =
        amorce.length < before.length || parenthesee
          ? amorce.match(
              /(r[ée]serv\w*|pren\w*)(\s+(?:un|vos?))?\s+(appel|rendez-vous)(\s+de\s+30\s*minutes)?\s*$/i,
            )
          : null;

      if (allowed.kind === 'booking' && invitation) {
        label = invitation[0].trim();
        before = amorce.slice(0, invitation.index);
        skipAfter = parenthesee ? 1 : 0;
      } else if (parenthesee) {
        before = amorce.replace(/\s+$/, ' ');
        skipAfter = 1;
      }
    }

    if (before) out.push(before);

    if (allowed) {
      out.push(
        <TextLink
          key={`${start}-${trimmed}`}
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
        </TextLink>,
      );
    } else {
      out.push(trimmed);
    }

    out.push(raw.slice(trimmed.length));
    last = start + raw.length + skipAfter;
  }

  if (last < text.length) out.push(text.slice(last));

  return out.map((node, index) => <Fragment key={index}>{node}</Fragment>);
}
