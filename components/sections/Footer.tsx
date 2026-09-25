import Link from 'next/link';
import { homepageContent } from '@/lib/content/homepage';
import { BOOKING_URL, CONTACT_EMAIL } from '@/lib/content/contact';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';

/**
 * Le pied de page, réduit à ce qu'on y cherche vraiment : qui parle, où
 * aller, et comment nous joindre. Le paragraphe « Collaboration » et la
 * ligne « Construit pour les entreprises qui construisent l'avenir »
 * sont partis : personne ne lit un manifeste en pied de page, et la
 * home le dit déjà mieux plus haut.
 *
 * La phrase descriptive, elle, est revenue — réécrite. Elle est le seul
 * texte qui dise l'activité sur toutes les pages du site, ce qui la rend
 * utile au référencement, et la retirer coûtait plus qu'elle ne pesait.
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
    <footer className="border-t border-rule bg-paper text-ink">
      <div className="mx-auto max-w-site px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <Stagger
          gap={0.06}
          className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16"
        >
          {/* Marque */}
          <StaggerItem>
            <span className="flex flex-col leading-none">
              <span className="font-sans text-[1.0625rem] font-extrabold tracking-[-0.02em] text-ink">
                {homepageContent.navigation.brand}
              </span>

              <span className="mt-1.5 font-sans text-micro uppercase tracking-signature text-ink-muted">
                {homepageContent.navigation.signature}
              </span>
            </span>

            {/* La seule phrase du site qui dise l'activité sur TOUTES les
                pages : c'est ce qui la rend utile au référencement, et
                c'est pourquoi elle revient après avoir disparu avec
                l'ancien pied de page. Elle dit « agence » et non
                « studio », comme partout ailleurs. */}
            <p className="mt-5 max-w-[34ch] text-[0.875rem] leading-[1.5] text-ink-muted">
              Agence d&apos;automatisation et d&apos;IA. Nous relions vos
              outils entre eux.
            </p>
          </StaggerItem>

          {/* Les colonnes de liens */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:gap-20">
            {colonnes.map((colonne) => (
              <StaggerItem key={colonne.titre}>
                <p className="font-sans text-micro uppercase text-ink-muted">
                  {colonne.titre}
                </p>

                <nav className="mt-5 flex flex-col items-start gap-3">
                  {colonne.liens.map((lien) => (
                    <Link
                      key={lien.label}
                      href={lien.href}
                      className="font-sans text-[0.9375rem] text-ink-body transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      {lien.label}
                    </Link>
                  ))}
                </nav>
              </StaggerItem>
            ))}

            {/* La colonne « Contact » : la voie légère pour qui a juste une
                question et ne veut pas remplir le formulaire en trois
                parties. Elle sort du tableau `colonnes` parce que ses deux
                liens quittent le site — un mailto et un créneau — et ne
                passent donc pas par `next/link`. Les classes, elles, sont
                exactement celles des colonnes voisines. */}
            <StaggerItem>
              <p className="font-sans text-micro uppercase text-ink-muted">
                Contact
              </p>

              <nav className="mt-5 flex flex-col items-start gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-sans text-[0.9375rem] text-ink-body transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  {CONTACT_EMAIL}
                </a>

                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.9375rem] text-ink-body transition-colors duration-200 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  Réserver un appel
                  <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
                </a>
              </nav>
            </StaggerItem>
          </div>

          {/* Action et mention de copyright */}
          <StaggerItem className="lg:text-right">
            <Button href="/demarrer-un-projet" variant="secondary" tone="strong">
              Démarrer un projet
            </Button>

            <p className="mt-6 text-[0.75rem] text-ink-muted">
              © 2026 NASSFLOW AGENCY
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </footer>
  );
}
