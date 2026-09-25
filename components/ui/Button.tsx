import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Les deux boutons du site.
 *
 * - `primary` : l'aplat vermillon, angles vifs, sans ombre. Le seul
 *   mouvement est un assombrissement au survol.
 * - `secondary` : pas un bouton mais un lien souligné d'un filet 1px,
 *   qui passe à l'encre au survol (`tone="strong"` : part de l'encre et
 *   passe au vermillon, comme dans le pied de page).
 *
 * Avec `href`, le composant rend un lien : `next/link` pour une route du
 * site, `<a>` pour une ancre (`#…`), un `mailto:` ou une URL externe.
 * Sans `href`, il rend un `<button>`.
 *
 * Au survol et au focus, le bouton plein fonce (`accent-hover`) et une
 * flèche avance de 3 px dans sa marge droite. Elle n'existe qu'à ce
 * moment-là : au repos, le bouton garde exactement sa taille et son
 * dessin. `arrow={false}` la retire (la bulle de l'assistant, qui ouvre
 * un panneau et ne mène nulle part).
 *
 * Désactivé, le bouton plein perd son vermillon plutôt que de pâlir :
 * fond `rule`, texte `ink-body` (7,76:1). L'ancienne opacité à 60 %
 * laissait le texte à 2,4:1.
 */

type Variant = 'primary' | 'secondary';

/** Tailles du bouton plein : 48px, 44px (en-tête, bulle), 40px (assistant). */
type Size = 'md' | 'sm' | 'xs';

type Tone = 'default' | 'strong';

type StyleProps = {
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  className?: string;
};

const focus = 'focus-visible:outline-2 focus-visible:outline-ink';

const styles = {
  primary: {
    base: `inline-flex items-center justify-center bg-accent font-sans font-semibold text-on-accent transition-colors hover:bg-accent-hover ${focus} focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-body disabled:hover:bg-rule`,
    size: {
      md: 'min-h-12 px-7 text-[0.9375rem]',
      sm: 'min-h-11 px-5 text-[0.875rem]',
      xs: 'min-h-10 px-5 text-[0.8125rem]',
    },
  },
  secondary: {
    base: `inline-flex items-center border-b border-ink pb-1 font-sans text-[0.9375rem] font-semibold transition-colors ${focus} focus-visible:outline-offset-4`,
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
