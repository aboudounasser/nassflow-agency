import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { solutions, type Solution } from '@/lib/content/solutions';

/**
 * Le catalogue, juste après les quatre symptômes : la section #systems
 * fait dire « c'est moi », celle-ci répond « voilà par où on commence ».
 *
 * Les cartes ont laissé la place à un index numéroté — six lignes, un
 * numéro, un titre, une citation. C'est la forme d'un sommaire, pas d'une
 * grille de produits : on ne vend pas six choses, on propose six points
 * d'entrée. Les filets font tout le travail de séparation.
 *
 * Les textes viennent tels quels de lib/content/solutions.ts — aucune
 * reformulation ici, la règle d'écriture vit dans le fichier de contenu.
 */

/** Les deux familles, dans l'ordre où elles s'affichent. */
const groups = [
  {
    category: 'agent' as const,
    title: 'Agents',
    description:
      'Ils parlent à vos clients et traitent ce qui arrive, avec vos mots et vos conditions.',
  },
  {
    category: 'automatisation' as const,
    title: 'Automatisations',
    description:
      'Elles font le travail répétitif à votre place, entre les outils que vous avez déjà.',
  },
];

/**
 * Une ligne d'index. Le numéro suit l'ordre du catalogue entier (01 à 06),
 * pas celui du groupe : c'est un sommaire unique, découpé en deux familles.
 *
 * En mobile la grille passe à deux colonnes — numéro et catégorie sur la
 * première ligne, puis le titre, puis la citation — d'où le placement
 * explicite de chaque cellule.
 */
function SolutionRow({
  solution,
  index,
}: {
  solution: Solution;
  index: number;
}) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group grid grid-cols-2 items-start gap-x-4 gap-y-3 border-t border-rule py-8 text-ink transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:grid-cols-[84px_1fr_250px] sm:gap-x-6 sm:py-10"
    >
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 font-serif text-[2.25rem] leading-none text-accent"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="col-start-2 row-start-1 justify-self-end self-center font-sans text-label uppercase tracking-tag text-ink-muted transition-colors duration-200 ease-out sm:col-start-3 sm:justify-self-end sm:self-start sm:pt-2 sm:text-right">
        {solution.categoryLabel}
      </span>

      <div className="col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
        {/* Au survol : l'encre passe au vermillon et le titre se souligne
            d'un filet 1px. Rien ne bouge, rien ne grandit. */}
        {/* Pas de classe de couleur ici : le titre hérite celle du lien,
            qui bascule au vermillon au survol. Un `text-ink` posé
            sur le h3 reprenait le dessus sur le `group-hover:`. */}
        <h3 className="font-heading text-subtitle underline-offset-[6px] group-hover:underline group-hover:decoration-1 group-focus-visible:underline group-focus-visible:decoration-1">
          {solution.title}
        </h3>

        <p className="mt-3 font-serif text-[1.3125rem] italic leading-[1.3] text-ink-muted">
          «&nbsp;{solution.problem}&nbsp;»
        </p>
      </div>
    </Link>
  );
}

export function SolutionsCatalog() {
  return (
    <section
      id="solutions"
      aria-label="Catalogue de solutions"
      className="border-t border-rule bg-paper text-ink"
    >
      <SectionShell className="py-16 sm:py-20 lg:py-24">
        <Reveal preset="soft" className="max-w-[24ch]">
          <Eyebrow>Par où on commence</Eyebrow>

          <SectionTitle
            className="mt-5"
            lead="Six points de départ,"
            voice="pas six produits."
          />
        </Reveal>

        <p className="mt-7 max-w-[62ch] text-body text-ink-body">
          Chacune s&apos;adapte à votre façon de travailler : vos tarifs, vos
          catégories, vos créneaux. Prenez celle qui vous parle, on part de là.
        </p>

        <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16">
          {groups.map((group) => (
            <div key={group.category}>
              {/* Titre et description sur la même ligne de base : la
                  description prolonge le titre au lieu de l'empiler. */}
              <Reveal
                preset="soft"
                className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <h3 className="shrink-0 font-sans text-[0.8125rem] font-bold uppercase tracking-label text-ink">
                  {group.title}
                </h3>

                <p className="max-w-[62ch] text-[0.9375rem] leading-[1.55] text-ink-muted">
                  {group.description}
                </p>
              </Reveal>

              <Stagger
                gap={0.08}
                className="mt-8 border-b border-rule"
              >
                {solutions
                  .filter((solution) => solution.category === group.category)
                  .map((solution) => (
                    <StaggerItem key={solution.slug}>
                      <SolutionRow
                        solution={solution}
                        index={solutions.indexOf(solution)}
                      />
                    </StaggerItem>
                  ))}
              </Stagger>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
