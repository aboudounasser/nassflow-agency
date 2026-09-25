'use client';

import Link from 'next/link';
import { AnimatePresence, m } from 'motion/react';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { Button } from '@/components/ui/Button';
import { homepageContent } from '@/lib/content/homepage';
import { transitions } from '@/lib/motion';

/**
 * Le panneau du menu mobile. Il vit dans son propre fichier pour être
 * chargé à la demande par `Navigation` : c'est lui qui porte Motion,
 * nécessaire ici pour animer une hauteur « auto » à l'ouverture et à la
 * fermeture (AnimatePresence).
 *
 * Monté au premier appui sur le bouton, il reste ensuite monté : c'est
 * `open` qui décide de l'ouverture, pour que la fermeture s'anime aussi.
 */
export default function MobileMenu({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <MotionProvider>
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitions.quick}
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
                  transition={{ ...transitions.quick, delay: 0.04 * index }}
                >
                  <Link
                    href={link.href}
                    className="flex min-h-12 items-center border-b border-rule font-sans text-base font-medium text-ink transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    onClick={onNavigate}
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
