import type { ComponentProps } from 'react';

/**
 * Le lien dans le texte : souligné, qui change de couleur au survol —
 * vers le vermillon dans un message, vers l'encre dans une note en gris
 * (`hover="ink"`).
 *
 * Toujours un `<a>` : ces liens vivent dans l'assistant, qui ouvre des
 * pages externes ou des pages légales qu'il n'y a pas lieu de
 * précharger.
 */

const hovers = {
  accent: 'hover:text-accent',
  ink: 'hover:text-ink',
} as const;

export function TextLink({
  hover = 'accent',
  className,
  ...props
}: Omit<ComponentProps<'a'>, 'className'> & {
  hover?: keyof typeof hovers;
  className?: string;
}) {
  return (
    <a
      className={['underline underline-offset-2', hovers[hover], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
