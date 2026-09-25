'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { homepageContent } from '@/lib/content/homepage';
import { Button } from '@/components/ui/Button';

/**
 * Le panneau du menu mobile est le seul endroit de l'en-tête qui anime
 * avec Motion. Il est chargé au premier geste sur le bouton (survol,
 * focus ou appui) plutôt qu'au chargement : ainsi l'en-tête, présent sur
 * toutes les pages, n'embarque plus la bibliothèque d'animation.
 */
const loadMobileMenu = () => import('@/components/MobileMenu');
const MobileMenu = dynamic(loadMobileMenu, { ssr: false });

/**
 * L'en-tête, en direction éditoriale : papier, un filet dessous, aucun
 * arrondi et aucun flou. La densification au défilement ne joue plus que
 * sur la hauteur — l'ancienne version changeait aussi l'opacité du fond et
 * posait une ombre, deux effets que la direction supprime.
 *
 * Le comportement du menu mobile n'est pas touché : état, fermeture au
 * clavier, blocage du défilement derrière le panneau et fermeture au clic
 * sur un lien viennent d'un correctif dédié (iPhone, ancres masquées par
 * l'en-tête).
 *
 * Le resserrement suit le défilement par un écouteur natif, limité à une
 * mise à jour par image : il n'a pas besoin d'un moteur d'animation.
 */

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setCondensed(window.scrollY > 24);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function prefetchMenu() {
    void loadMobileMenu();
  }

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
    <header className="sticky top-0 z-(--z-header) border-b border-rule bg-paper text-ink">
      <div
        className={[
          'mx-auto flex max-w-site items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8',
          condensed
            ? 'h-header-condensed lg:h-header-condensed-lg'
            : 'h-header lg:h-header-lg',
        ].join(' ')}
      >
        {/* Marque */}
        <Link
          href="/"
          className="group flex min-h-11 items-center"
          onClick={closeMenu}
        >
          {/* Pas d'aria-label : il remplaçait le texte visible au lieu de
              le contenir. Le nom accessible est désormais « Accueil,
              NASSFLOW AGENCY VOS OUTILS, RELIÉS ». */}
          <span className="sr-only">Accueil, </span>
          <span className="flex flex-col leading-none">
            <span className="font-sans text-[1.0625rem] font-extrabold tracking-[-0.02em] text-ink transition-colors duration-200 group-hover:text-accent">
              {homepageContent.navigation.brand}
            </span>

            {/* Signature : 10px · 600 · 0.24em · majuscules. */}
            <span className="mt-1.5 font-sans text-micro uppercase tracking-signature text-ink-muted">
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
              className="font-sans text-[0.875rem] font-medium text-ink transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop. L'enveloppe porte le masquage mobile : posé sur
            le bouton, `hidden` perdrait contre son `inline-flex`. */}
        <div className="hidden md:flex">
          <Button href="/demarrer-un-projet" size="sm">
            {homepageContent.navigation.cta}
          </Button>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onPointerEnter={prefetchMenu}
          onFocus={prefetchMenu}
          onClick={() => {
            setMenuLoaded(true);
            setMenuOpen(!menuOpen);
          }}
          className="relative z-(--z-overlay) inline-flex h-11 w-11 shrink-0 items-center justify-center border border-rule text-ink transition-colors duration-200 hover:border-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:hidden"
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

      {/* Menu mobile : chargé au premier geste, voir MobileMenu.tsx. */}
      {menuLoaded && <MobileMenu open={menuOpen} onNavigate={closeMenu} />}
    </header>
  );
}
