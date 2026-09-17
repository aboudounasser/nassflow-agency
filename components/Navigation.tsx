'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react';
import { homepageContent } from '@/lib/content/homepage';
import { transitions } from '@/lib/motion';

/**
 * L'en-tête, en direction éditoriale : papier, un filet dessous, aucun
 * arrondi et aucun flou. La densification au défilement ne joue plus que
 * sur la hauteur — l'ancienne version changeait aussi l'opacité du fond et
 * posait une ombre, deux effets que la direction supprime.
 *
 * Le comportement du menu mobile n'est pas touché : état, fermeture au
 * clavier, blocage du défilement derrière le panneau et fermeture au clic
 * sur un lien viennent d'un correctif dédié (iPhone, ancres masquées par
 * l'en-tête). Seuls les jetons de couleur et de police ont changé.
 */

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => {
    setCondensed(value > 24);
  });

  function closeMenu() {
    setMenuOpen(false);
  }

  // Le menu mobile ne se fermait pas au clavier et laissait la page
  // défiler derrière lui.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]">
      <div
        className={[
          'mx-auto flex max-w-[1280px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8',
          condensed ? 'h-[62px] lg:h-[70px]' : 'h-[68px] lg:h-[82px]',
        ].join(' ')}
      >
        {/* Marque */}
        <Link
          href="/"
          className="group flex min-h-11 items-center"
          aria-label="Accueil NASSFLOW AGENCY"
          onClick={closeMenu}
        >
          <span className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-archivo)] text-[1.0625rem] font-extrabold tracking-[-0.02em] text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--accent)]">
              {homepageContent.navigation.brand}
            </span>

            {/* Signature : 10px · 600 · 0.24em · majuscules. */}
            <span className="mt-1.5 font-[family-name:var(--font-archivo)] text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              {homepageContent.navigation.signature}
            </span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-7 md:flex lg:gap-9"
        >
          {homepageContent.navigation.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-[family-name:var(--font-archivo)] text-[0.875rem] font-medium text-[var(--ink)] transition-colors duration-200 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <Link
          href="/demarrer-un-projet"
          className="hidden min-h-11 items-center justify-center bg-[var(--accent)] px-5 font-[family-name:var(--font-archivo)] text-[0.875rem] font-semibold text-[var(--on-accent)] transition-colors duration-200 ease-out hover:bg-[#B92C18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] md:inline-flex"
        >
          {homepageContent.navigation.cta}
        </Link>

        {/* Bouton menu mobile */}
        <button
          type="button"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-[60] inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--rule)] text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] md:hidden"
        >
          <span className="sr-only">
            {menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          </span>

          <span className="relative flex h-5 w-5 items-center justify-center">
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                menuOpen ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />

            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                menuOpen ? '-rotate-45' : 'translate-y-1.5'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <m.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitions.quick}
            className="overflow-hidden border-t border-[var(--rule)] bg-[var(--paper)] md:hidden"
          >
            <nav
              aria-label="Menu mobile"
              className="mx-auto flex max-w-[1280px] flex-col px-4 py-2 sm:px-6"
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
                    className="flex min-h-12 items-center border-b border-[var(--rule)] font-[family-name:var(--font-archivo)] text-base font-medium text-[var(--ink)] transition-colors duration-150 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}

              <div className="py-4">
                <Link
                  href="/demarrer-un-projet"
                  className="inline-flex min-h-12 w-full items-center justify-center bg-[var(--accent)] px-6 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--on-accent)] transition-colors duration-200 ease-out hover:bg-[#B92C18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                  onClick={closeMenu}
                >
                  {homepageContent.navigation.cta}
                </Link>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
