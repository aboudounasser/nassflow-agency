'use client';

import { useRef, type MouseEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'motion/react';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { Button } from '@/components/ui/Button';
import { homepageContent } from '@/lib/content/homepage';
import { motionTokens, seconds, transitions } from '@/lib/motion';

/**
 * Le panneau du menu mobile. Il vit dans son propre fichier pour être
 * chargé à la demande par `Navigation` : c'est lui qui porte Motion,
 * nécessaire ici pour animer une hauteur « auto » à l'ouverture et à la
 * fermeture (AnimatePresence).
 *
 * Monté au premier appui sur le bouton, il reste ensuite monté : c'est
 * `open` qui décide de l'ouverture, pour que la fermeture s'anime aussi.
 *
 * Ancres de l'accueil : le panneau est dans le flux, sous l'en-tête
 * collant. Laisser le lien défiler tout de suite visait la section menu
 * ouvert ; le repli du panneau remontait ensuite la page de sa hauteur,
 * et le titre visé finissait sous l'en-tête. Depuis l'accueil, on ferme
 * donc d'abord, et on ne défile qu'une fois le panneau replié.
 */
export default function MobileMenu({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const pendingHash = useRef<string | null>(null);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('/#') && window.location.pathname === '/') {
      event.preventDefault();
      pendingHash.current = href.slice(1);
    }

    onNavigate();
  }

  function scrollToPending() {
    const hash = pendingHash.current;
    pendingHash.current = null;
    if (!hash) return;

    window.history.pushState(null, '', hash);
    // `scrollIntoView` respecte le `scroll-padding-top` de l'en-tête.
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }

  return (
    <MotionProvider>
      <AnimatePresence onExitComplete={scrollToPending}>
        {open && (
          <m.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: transitions.exit }}
            transition={transitions.base}
            className="overflow-hidden border-t border-rule bg-paper md:hidden"
          >
            <nav
              aria-label="Menu mobile"
              className="mx-auto flex max-w-site flex-col px-4 py-2 sm:px-6"
            >
              {homepageContent.navigation.links.map((link, index) => (
                <m.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...transitions.base,
                    delay: seconds(motionTokens.stagger) * index,
                  }}
                >
                  <Link
                    href={link.href}
                    className="flex min-h-12 items-center border-b border-rule font-sans text-base font-medium text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    onClick={(event) => handleClick(event, link.href)}
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}

              <div className="py-4">
                <Button
                  href="/demarrer-un-projet"
                  className="w-full"
                  onClick={onNavigate}
                >
                  {homepageContent.navigation.cta}
                </Button>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </MotionProvider>
  );
}
