import { renderBrandIcon } from '@/lib/brand-icon';

/** L'icône d'onglet. Voir `lib/brand-icon.tsx` pour le dessin. */
export const size = { width: 32, height: 32 };

export const contentType = 'image/png';

export default function Icon() {
  return renderBrandIcon(size.width);
}
