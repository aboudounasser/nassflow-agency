import Link from 'next/link';
import { homepageContent } from '@/lib/content/homepage';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

/**
 * Le pied de page, réduit à ce qu'on y cherche vraiment : qui parle, où
 * aller, et comment nous joindre. Les trois blocs de prose qui s'y
 * trouvaient — la description du studio, le paragraphe « Collaboration »
 * et la ligne « Construit pour les entreprises qui construisent
 * l'avenir » — sont retirés : personne ne lit un manifeste en pied de
 * page, et la home le dit déjà mieux plus haut.
 */

const colonnes = [
  {
    titre: 'Le site',
    liens: [
      { label: 'Accueil', href: '/' },
      { label: 'Problèmes', href: '/#systems' },
      { label: 'Solutions', href: '/#solutions' },
      { label: 'Intégrations', href: '/#outils' },
    ],
  },
  {
    titre: 'Légal',
    liens: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <Stagger
          gap={0.06}
          className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16"
        >
          {/* Marque */}
          <StaggerItem>
            <span className="flex flex-col leading-none">
              <span className="font-[family-name:var(--font-archivo)] text-[1.0625rem] font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                {homepageContent.navigation.brand}
              </span>

              <span className="mt-1.5 font-[family-name:var(--font-archivo)] text-[0.625rem] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                {homepageContent.navigation.signature}
              </span>
            </span>
          </StaggerItem>

          {/* Les deux colonnes de liens */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:gap-20">
            {colonnes.map((colonne) => (
              <StaggerItem key={colonne.titre}>
                <p className="font-[family-name:var(--font-archivo)] text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  {colonne.titre}
                </p>

                <nav className="mt-5 flex flex-col items-start gap-3">
                  {colonne.liens.map((lien) => (
                    <Link
                      key={lien.label}
                      href={lien.href}
                      className="font-[family-name:var(--font-archivo)] text-[0.9375rem] text-[var(--ink-body)] transition-colors duration-200 hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
                    >
                      {lien.label}
                    </Link>
                  ))}
                </nav>
              </StaggerItem>
            ))}
          </div>

          {/* Action et mention de copyright */}
          <StaggerItem className="lg:text-right">
            <Link
              href="/demarrer-un-projet"
              className="inline-flex items-center border-b border-[var(--ink)] pb-1 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--ink)] transition-colors duration-200 ease-out hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              Démarrer un projet
            </Link>

            <p className="mt-6 text-[0.75rem] text-[var(--ink-muted)]">
              © 2026 NASSFLOW AGENCY
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </footer>
  );
}
