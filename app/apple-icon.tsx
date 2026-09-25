import { renderBrandIcon } from '@/lib/brand-icon';

/** L'icône d'écran d'accueil iOS. Voir `lib/brand-icon.tsx` pour le dessin. */
export const size = { width: 180, height: 180 };

export const contentType = 'image/png';

export default function AppleIcon() {
  return renderBrandIcon(size.width);
}
