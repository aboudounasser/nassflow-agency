'use client';

import { useEffect, useState } from 'react';
import { reducedMotionQuery } from '@/lib/motion';

/**
 * `true` quand le système est réglé sur « réduire les animations ».
 *
 * On lit la media query nous-mêmes plutôt que d'utiliser le hook de la
 * bibliothèque : celui-ci dépend du réglage `reducedMotion` de
 * `MotionConfig`, dont la valeur par défaut le fait toujours répondre
 * `false`. Le résultat est faux au premier rendu serveur, puis corrigé
 * dès le montage — les animations concernées ne démarrent pas avant.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(reducedMotionQuery);
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}
