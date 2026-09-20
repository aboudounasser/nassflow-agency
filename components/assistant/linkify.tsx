import { Fragment, type ReactNode } from 'react';
import { BOOKING_URL } from '@/lib/content/contact';

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
 */

const URL_PATTERN = /https?:\/\/[^\s<>"')\]]+/g;

/** L'hôte de réservation, dérivé de la constante plutôt que réécrit. */
const bookingHost = new URL(BOOKING_URL).hostname.toLowerCase();

function isAllowed(raw: string): boolean {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;

  const host = url.hostname.toLowerCase();

  // `endsWith('.nassflow.com')` et non `includes` : « nassflow.com.ru »
  // passerait le second.
  const isNassflow =
    host === 'nassflow.com' || host.endsWith('.nassflow.com');

  return isNassflow || host === bookingHost;
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

    if (start > last) out.push(text.slice(last, start));

    if (isAllowed(trimmed)) {
      out.push(
        <a
          key={`${start}-${trimmed}`}
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--accent)]"
        >
          {trimmed}
        </a>,
      );
    } else {
      out.push(trimmed);
    }

    out.push(raw.slice(trimmed.length));
    last = start + raw.length;
  }

  if (last < text.length) out.push(text.slice(last));

  return out.map((node, index) => <Fragment key={index}>{node}</Fragment>);
}
