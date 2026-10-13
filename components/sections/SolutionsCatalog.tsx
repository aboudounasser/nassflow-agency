import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { solutions, type Solution } from '@/lib/content/solutions';
import { Rise } from '@/components/motion/Rise';
import { Trace } from '@/components/motion/Trace';

/**
 * Le catalogue, juste après les quatre symptômes : la section #systems
 * fait dire « c'est moi », celle-ci répond « voilà par où on commence ».
 *
 * Six cartes, en deux familles : un numéro, la catégorie en badge, un
 * titre, une citation. On ne vend pas six choses, on propose six points
 * d'entrée — d'où le numéro, qui garde la lecture d'un sommaire.
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
 * Une carte. Le numéro suit l'ordre du catalogue entier (01 à 06), pas
 * celui du groupe : c'est un sommaire unique, découpé en deux familles.
 *
 * Au survol (appareils qui le permettent) et au focus, la carte monte de
 * 4 px, son filet s'éclaircit et une ombre douce apparaît (durée `base`).
 * Elle apparaît au défilement, en cascade dans son groupe (Rise).
 */
function SolutionCard({
  solution,
  index,
  order,
}: {
  solution: Solution;
  index: number;
  /** Rang dans le groupe, pour la cascade d'apparition. */
  order: number;
}) {
  return (
    <Rise as="li" order={order} className="flex">
      <Link
        href={`/solutions/${solution.slug}`}
        className="group flex w-full flex-col rounded-card border border-rule bg-surface p-6 text-ink transition-[transform,border-color,box-shadow] duration-(--motion-duration-base) hover:-translate-y-1 hover:border-rule-strong hover:shadow-card focus-visible:-translate-y-1 focus-visible:border-rule-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-7"
      >
        <span className="flex items-center justify-between gap-4">
          <span
            aria-hidden="true"
            className="font-serif text-[2.25rem] leading-none text-accent"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="rounded-pill border border-rule px-3 py-1 font-sans text-label uppercase tracking-tag text-ink-muted">
            {solution.categoryLabel}
          </span>
        </span>

        <h3 className="mt-8 font-heading text-subtitle">{solution.title}</h3>

        <p className="mt-3 font-serif text-[1.3125rem] italic leading-[1.3] text-ink-muted">
          «&nbsp;{solution.problem}&nbsp;»
        </p>
      </Link>
    </Rise>
  );
}

export function SolutionsCatalog() {
  return (
    <section
      id="solutions"
      aria-label="Catalogue de solutions"
      className="bg-paper text-ink"
    >
      <Trace />

      <SectionShell className="py-section">
        <Rise>
          <div>
            <Eyebrow>Par où on commence</Eyebrow>

            {/* La limite est sur le titre, en `ch` de SA taille : posée sur
                l'enveloppe, 24ch du texte courant (≈ 216px) coupaient le
                titre mot par mot. */}
            <SectionTitle
              className="mt-5 max-w-[16ch]"
              lead="Six points de départ,"
              voice="pas six produits."
            />
          </div>

          <p className="mt-7 max-w-measure text-body text-ink-body">
            Chacune s&apos;adapte à votre façon de travailler : vos tarifs, vos
            catégories, vos créneaux. Prenez celle qui vous parle, on part de là.
          </p>
        </Rise>

        <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16">
          {groups.map((group) => (
            <div key={group.category}>
              {/* Titre et description sur la même ligne de base : la
                  description prolonge le titre au lieu de l'empiler. */}
              <Rise className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                <h3 className="shrink-0 font-sans text-[0.8125rem] font-bold uppercase tracking-label text-ink">
                  {group.title}
                </h3>

                <p className="max-w-measure text-[0.9375rem] leading-[1.55] text-ink-muted">
                  {group.description}
                </p>
              </Rise>

              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {solutions
                  .filter((solution) => solution.category === group.category)
                  .map((solution, order) => (
                    <SolutionCard
                      key={solution.slug}
                      solution={solution}
                      index={solutions.indexOf(solution)}
                      order={order}
                    />
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
