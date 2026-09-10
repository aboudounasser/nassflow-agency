import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export function Footer() {
  return (
    <footer className="border-t border-[#1A2128] bg-[#0A0D12]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Stagger
          gap={0.06}
          className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {/* Marque */}
          <StaggerItem>
            <div className="mb-4 font-[family-name:var(--font-sora)] text-[0.7rem] uppercase tracking-[0.18em] text-[#CDD5DD]">
              NASSFLOW
            </div>

            <div className="mb-3 max-w-xs text-[0.8rem] leading-6 text-[#8E98A3]">
              Studio IA spécialisé en automatisation et systèmes digitaux.
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[#7CC7FF]">
              <span>AI</span>
              <span>•</span>
              <span>AUTOMATION</span>
              <span>•</span>
              <span>WEB</span>
            </div>
          </StaggerItem>

          {/* Navigation */}
          <StaggerItem>
            <div className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
              Navigation
            </div>

            <nav className="flex flex-col items-start gap-2.5">
              <Link
                href="/"
                className="link-underline w-fit text-[0.8rem] text-[#CDD5DD] transition-colors duration-200 hover:text-[#F4F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
              >
                Accueil
              </Link>

              <Link
                href="/#approach"
                className="link-underline w-fit text-[0.8rem] text-[#CDD5DD] transition-colors duration-200 hover:text-[#F4F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
              >
                Système
              </Link>

              <Link
                href="/#outils"
                className="link-underline w-fit text-[0.8rem] text-[#CDD5DD] transition-colors duration-200 hover:text-[#F4F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
              >
                Outils
              </Link>

              <Link
                href="/#systems"
                className="link-underline w-fit text-[0.8rem] text-[#CDD5DD] transition-colors duration-200 hover:text-[#F4F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
              >
                Solutions
              </Link>

              <Link
                href="/contact"
                className="link-underline w-fit text-[0.8rem] text-[#CDD5DD] transition-colors duration-200 hover:text-[#F4F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
              >
                Contact
              </Link>
            </nav>
          </StaggerItem>

          {/* Collaboration */}
          <StaggerItem>
            <div className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
              Collaboration
            </div>

            <p className="max-w-xs text-[0.8rem] leading-6 text-[#CDD5DD]">
              Nous construisons des systèmes pour des entreprises qui osent
              innover.
            </p>
          </StaggerItem>

          {/* Action */}
          <StaggerItem>
            <div className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
              Action
            </div>

            <Link
              href="/demarrer-un-projet"
              className="inline-flex min-h-11 items-center rounded-full border border-[#2A333C] px-4 py-2 text-[0.8rem] text-[#CDD5DD] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#7CC7FF] hover:text-[#F4F7FA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12]"
            >
              Démarrer un projet
            </Link>
          </StaggerItem>
        </Stagger>

        {/* Bas du footer */}
        <div className="border-t border-[#1A2128] pt-6">
          <div className="flex flex-col gap-4 text-[0.75rem] text-[#8E98A3]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="font-medium text-[#CDD5DD]">
                © 2026 NASSFLOW AGENCY
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="hidden text-[#2A333C] sm:inline">•</span>

                <Link
                  href="/mentions-legales"
                  className="link-underline text-[#8E98A3] transition-colors duration-200 hover:text-[#7CC7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF]"
                >
                  Mentions légales
                </Link>

                <span className="hidden text-[#2A333C] sm:inline">•</span>

                <Link
                  href="/confidentialite"
                  className="link-underline text-[#8E98A3] transition-colors duration-200 hover:text-[#7CC7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF]"
                >
                  Politique de confidentialité
                </Link>
              </div>
            </div>

            <div className="text-[0.7rem] leading-5 text-[#8E98A3]">
              Construit pour les entreprises qui construisent l&apos;avenir.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}