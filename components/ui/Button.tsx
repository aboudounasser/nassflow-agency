import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Les deux boutons du site.
 *
 * - `primary` : l'aplat vermillon, angles arrondis (`rounded-button`),
 *   texte SOMBRE (`on-accent` : le blanc échoue sur ce vermillon). Au
 *   survol il s'éclaircit, monte d'1 px et prend un léger halo ; à
 *   l'appui il s'enfonce.
 * - `secondary` : pas un bouton mais un lien souligné d'un filet 1px,
 *   qui passe à l'encre au survol (`tone="strong"` : part de l'encre et
 *   passe au vermillon, comme dans le pied de page). Il monte aussi
 *   d'1 px au survol.
 *
 * Le survol n'existe que sur les appareils qui le permettent : Tailwind 4
 * enveloppe `hover:` dans `@media (hover: hover)`. Au clavier, un anneau
 * vermillon (6,39:1 sur le fond).
 *
 * Avec `href`, le composant rend un lien : `next/link` pour une route du
 * site, `<a>` pour une ancre (`#…`), un `mailto:` ou une URL externe.
 * Sans `href`, il rend un `<button>`.
 *
 * Au survol et au focus, le bouton plein s'éclaircit (`accent-hover`) et une
 * flèche avance de 3 px dans sa marge droite. Elle n'existe qu'à ce
 * moment-là : au repos, le bouton garde exactement sa taille et son
 * dessin. `arrow={false}` la retire (la bulle de l'assistant, qui ouvre
 * un panneau et ne mène nulle part).
 *
 * Désactivé, le bouton plein perd son vermillon plutôt que de pâlir :
 * fond `rule`, texte `ink-body` (11,27:1). Une opacité réduite aurait
 * fait tomber le texte sous le seuil.
 */

type Variant = 'primary' | 'secondary';

/** Tailles du bouton plein : 48px, puis 44px (en-tête, bulle, assistant) :
 * jamais moins de 44px, la taille d'une cible tactile. `xs` ne diffère
 * de `sm` que par le corps du texte. */
type Size = 'md' | 'sm' | 'xs';

type Tone = 'default' | 'strong';

type StyleProps = {
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  className?: string;
};

const focus = 'focus-visible:outline-2 focus-visible:outline-accent';

/** Survol : montée d'1 px ; appui : le bouton s'enfonce. */
const lift =
  'transition-[background-color,color,transform,box-shadow] hover:-translate-y-px active:translate-y-px';

const styles = {
  primary: {
    base: `inline-flex items-center justify-center rounded-button bg-accent font-sans font-semibold text-on-accent ${lift} hover:bg-accent-hover hover:shadow-glow ${focus} focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-body disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-rule`,
    size: {
      md: 'min-h-12 px-7 text-[0.9375rem]',
      sm: 'min-h-11 px-5 text-[0.875rem]',
      xs: 'min-h-11 px-5 text-[0.8125rem]',
    },
  },
  secondary: {
    // Le lien fait 28px de haut : un pseudo-élément étend sa zone
    // tactile à 48px, sans éloigner le filet du texte.
    base: `relative inline-flex items-center border-b border-ink pb-1 font-sans text-[0.9375rem] font-semibold after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] ${lift} ${focus} focus-visible:outline-offset-4`,
    tone: {
      default: 'text-ink-body hover:text-ink',
      strong: 'text-ink hover:text-accent',
    },
  },
} as const;

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  tone = 'default',
  className,
}: StyleProps = {}) {
  const parts =
    variant === 'primary'
      ? [styles.primary.base, styles.primary.size[size]]
      : [styles.secondary.base, styles.secondary.tone[tone]];

  return [...parts, className].filter(Boolean).join(' ');
}

type ArrowProps = {
  /** Flèche au survol, bouton plein uniquement (par défaut : oui). */
  arrow?: boolean;
};

type LinkButtonProps = StyleProps &
  ArrowProps &
  Omit<ComponentProps<'a'>, 'className' | 'href'> & {
    href: string;
    children: ReactNode;
  };

type NativeButtonProps = StyleProps &
  ArrowProps &
  Omit<ComponentProps<'button'>, 'className'> & {
    href?: undefined;
    children: ReactNode;
  };

/** Retrait de la flèche dans la marge droite, selon la taille. */
const arrowInset = { md: 'right-2.5', sm: 'right-1.5', xs: 'right-1.5' } as const;

/** La flèche : deux traits vifs, dans la couleur du texte. */
function Arrow({ size }: { size: Size }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 flex -translate-x-[3px] items-center opacity-0 transition-[opacity,transform] group-hover/button:translate-x-0 group-hover/button:opacity-100 group-focus-visible/button:translate-x-0 group-focus-visible/button:opacity-100 group-disabled/button:hidden ${arrowInset[size]}`}
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0 4h9M5.5.5 9 4 5.5 7.5" strokeLinejoin="miter" />
      </svg>
    </span>
  );
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', tone, arrow = true, className, ...rest } =
    props;
  const withArrow = variant === 'primary' && arrow;
  const classes = buttonClasses({
    variant,
    size,
    tone,
    className: [withArrow ? 'group/button relative' : '', className]
      .filter(Boolean)
      .join(' '),
  });

  const children = withArrow ? (
    <>
      {rest.children}
      <Arrow size={size} />
    </>
  ) : (
    rest.children
  );

  if (rest.href === undefined) {
    const { type = 'button', ...buttonProps } = rest as Omit<
      NativeButtonProps,
      keyof StyleProps | 'arrow'
    >;

    return (
      <button type={type} className={classes} {...buttonProps}>
        {children}
      </button>
    );
  }

  const { href, ...anchorProps } = rest as Omit<
    LinkButtonProps,
    keyof StyleProps | 'arrow'
  >;

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...anchorProps}>
      {children}
    </a>
  );
}
