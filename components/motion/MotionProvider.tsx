'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

/**
 * Déclare une seule fois le jeu de fonctionnalités d'animation utilisé par
 * le site — `domAnimation` : transitions, variantes, `whileInView`,
 * `AnimatePresence`. Le reste du moteur (animations de layout, drag,
 * projection) n'est jamais chargé.
 *
 * C'est ce qui permet aux composants d'utiliser `m.div` au lieu de
 * `motion.div` : `m` est la version légère, qui s'appuie sur le moteur
 * déclaré ici. `strict` fait échouer la compilation si un `motion.*`
 * se glisse quelque part et réintroduit le moteur complet.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* `reducedMotion="user"` : le moteur cesse de lui-même d'animer les
          transformations quand le système demande moins d'animations, en ne
          gardant que les fondus. Sans ce réglage, sa valeur par défaut
          (« never ») ignore complètement la préférence de l'utilisateur. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
