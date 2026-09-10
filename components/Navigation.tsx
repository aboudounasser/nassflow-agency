'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react';
import { homepageContent } from '@/lib/content/homepage';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { transitions } from '@/lib/motion';

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  const { scrollY } = useScroll();

  // L'en-tête se densifie dès qu'on quitte le haut de page : bordure plus
  // marquée, fond plus opaque, hauteur légèrement réduite.
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
    <header
      className={[
        'sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300',
        condensed
          ? 'border-[#2A333C] bg-[#0A0D12]/92 shadow-[0_10px_40px_rgba(0,0,0,0.35)]'
          : 'border-[#2A333C]/50 bg-[#0A0D12]/70',
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto flex max-w-[1280px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8',
          condensed ? 'h-[62px] lg:h-[70px]' : 'h-[68px] lg:h-[82px]',
        ].join(' ')}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3"
          aria-label="Accueil NASSFLOW AGENCY"
          onClick={closeMenu}
        >
          <div className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-sora)] text-[0.68rem] font-semibold tracking-[0.16em] text-[#F4F7FA] transition-colors duration-200 group-hover:text-[#A9D9FF] min-[380px]:text-[0.72rem] sm:text-[0.78rem]">
              {homepageContent.navigation.brand}
            </span>

            <span className="mt-1 text-[0.5rem] uppercase tracking-[0.16em] text-[#8E98A3] min-[380px]:text-[0.56rem] sm:text-[0.6rem]">
              {homepageContent.navigation.signature}
            </span>
          </div>
        </Link>

        {/* Navigation desktop */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-5 md:flex lg:gap-7"
        >
          {homepageContent.navigation.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="link-underline text-sm font-medium text-[#CDD5DD] transition-colors duration-200 hover:text-[#A9D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0D12]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:block">
          <ButtonPrimary
            href="/demarrer-un-projet"
            className="px-4 py-2.5 text-sm"
          >
            {homepageContent.navigation.cta}
          </ButtonPrimary>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-[60] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2A333C] bg-[#10161D] text-[#F4F7FA] transition-all duration-200 hover:border-[#7CC7FF] hover:text-[#A9D9FF] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12] md:hidden"
        >
          <span className="sr-only">
            {menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          </span>

          <span className="relative flex h-5 w-5 items-center justify-center">
            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                menuOpen ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />

            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />

            <span
              className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
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
            className="overflow-hidden border-t border-[#2A333C] bg-[#0A0D12] md:hidden"
          >
            <nav
              aria-label="Menu mobile"
              className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-4 sm:px-6 sm:py-5"
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
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium text-[#CDD5DD] transition-colors duration-150 hover:bg-[#141B22] hover:text-[#A9D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF]"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}

              <div className="pt-3">
                <ButtonPrimary
                  href="/demarrer-un-projet"
                  className="w-full justify-center"
                  onClick={closeMenu}
                >
                  {homepageContent.navigation.cta}
                </ButtonPrimary>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
