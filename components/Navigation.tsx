'use client';

import { useState } from 'react';
import Link from 'next/link';
import { homepageContent } from '@/lib/content/homepage';
import { ButtonPrimary } from '@/components/ui/ButtonPrimary';

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A333C]/80 bg-[#0A0D12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:h-[82px] lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3"
          aria-label="Accueil NASSFLOW AGENCY"
          onClick={closeMenu}
        >
          <div className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-sora)] text-[0.68rem] font-semibold tracking-[0.16em] text-[#F4F7FA] min-[380px]:text-[0.72rem] sm:text-[0.78rem]">
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
          className="hidden items-center gap-7 md:flex"
        >
          {homepageContent.navigation.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#CDD5DD] transition-colors duration-200 hover:text-[#A9D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
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
      <div
        id="mobile-navigation"
        className={`border-t border-[#2A333C] bg-[#0A0D12] md:hidden ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav
          aria-label="Menu mobile"
          className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-4 sm:px-6 sm:py-5"
        >
          {homepageContent.navigation.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium text-[#CDD5DD] transition-colors duration-150 hover:bg-[#141B22] hover:text-[#A9D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF]"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
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
      </div>
    </header>
  );
}