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
    base: `inline-flex items-center justify-center bg-accent font-sans font-semibold text-on-accent transition-colors duration-200 ease-out hover:bg-accent-hover ${focus} focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60`,
    size: {
      md: 'min-h-12 px-7 text-[0.9375rem]',
      sm: 'min-h-11 px-5 text-[0.875rem]',
      xs: 'min-h-10 px-5 text-[0.8125rem]',
    },
  },
  secondary: {
    base: `inline-flex items-center border-b border-ink pb-1 font-sans text-[0.9375rem] font-semibold transition-colors duration-200 ease-out ${focus} focus-visible:outline-offset-4`,
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

type LinkButtonProps = StyleProps &
  Omit<ComponentProps<'a'>, 'className' | 'href'> & {
    href: string;
    children: ReactNode;
  };

type NativeButtonProps = StyleProps &
  Omit<ComponentProps<'button'>, 'className'> & {
    href?: undefined;
    children: ReactNode;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant, size, tone, className, ...rest } = props;
  const classes = buttonClasses({ variant, size, tone, className });

  if (rest.href === undefined) {
    const { type = 'button', ...buttonProps } = rest as Omit<
      NativeButtonProps,
      keyof StyleProps
    >;

    return <button type={type} className={classes} {...buttonProps} />;
  }

  const { href, ...anchorProps } = rest as Omit<LinkButtonProps, keyof StyleProps>;

  if (href.startsWith('/')) {
    return <Link href={href} className={classes} {...anchorProps} />;
  }

  return <a href={href} className={classes} {...anchorProps} />;
}
