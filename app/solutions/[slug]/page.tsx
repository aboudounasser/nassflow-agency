import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionShell } from '@/components/SectionShell';
import { Reveal } from '@/components/motion/Reveal';
import { SolutionRequestForm } from '@/components/sections/SolutionRequestForm';
import { solutions } from '@/lib/content/solutions';

/**
 * Une page par solution, générée à la compilation depuis le catalogue.
 *
 * `dynamicParams = false` ferme la route à tout slug absent du contenu :
 * le catalogue est la seule source, il ne doit pas exister d'URL de
 * solution qui ne corresponde à rien. `notFound()` couvre malgré tout le
 * cas en développement, où les params ne sont pas pré-validés.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

function findSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = findSolution(slug);

  if (!solution) return {};

  return {
    title: `${solution.title} | NASSFLOW AGENCY`,
    // `delivers` décrit ce qu'on installe : c'est déjà une description,
    // inutile d'en réécrire une qui dirait la même chose autrement.
    description: solution.delivers,
    alternates: { canonical: `/solutions/${solution.slug}` },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = findSolution(slug);

  if (!solution) notFound();

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <SectionShell className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[820px] px-1 sm:px-0">
          <Reveal onMount preset="soft">
            {/* Même motif de retour que /demarrer-un-projet,
                pointé sur l'ancre du catalogue plutôt que sur le haut de
                la home : on revient là d'où l'on vient. */}
            <Link
              href="/#solutions"
              className="mb-12 inline-flex items-center border-b border-[var(--ink)] pb-1 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--ink-body)] transition-colors duration-200 ease-out hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] sm:mb-16"
            >
              ← Retour aux solutions
            </Link>

            <span className="block font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {solution.categoryLabel}
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-archivo)] text-[clamp(2.125rem,6.4vw,4rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-[var(--ink)]">
              {solution.title}
            </h1>

            {/* La phrase du dirigeant, citée comme sur la home. */}
            <p className="mt-6 max-w-[30ch] font-[family-name:var(--font-serif)] text-[1.75rem] italic leading-[1.25] text-[var(--ink-muted)]">
              «&nbsp;{solution.problem}&nbsp;»
            </p>
          </Reveal>

          <Reveal preset="soft" delay={0.12} className="mt-10 sm:mt-12">
            <div className="border-t border-[var(--rule)] pt-8">
              <h2 className="font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                Ce qu&apos;on installe
              </h2>

              <p className="mt-5 max-w-[48ch] text-[1.375rem] leading-[1.4] text-[var(--ink)]">
                {solution.delivers}
              </p>

              <ul className="mt-10">
                {solution.includes.map((item) => (
                  <li
                    key={item}
                    className="border-t border-[var(--rule)] py-5 text-[1.0625rem] leading-[1.55] text-[var(--ink-body)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Le formulaire tire ses champs spécifiques de
              `solution.questions` et poste sur /api/solution-requests,
              qui écrit en service_role : la table refuse anon. */}
          <Reveal preset="soft" delay={0.18} className="mt-12 sm:mt-16">
            <h2 className="font-[family-name:var(--font-archivo)] text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[var(--ink)]">
              Dites-nous où vous en êtes
            </h2>

            <p className="mt-4 max-w-[52ch] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
              On part de votre situation, pas d&apos;un modèle tout fait.
            </p>

            <div className="mt-8 sm:mt-10">
              <SolutionRequestForm solution={solution} />
            </div>
          </Reveal>

          <Reveal preset="soft" delay={0.24} className="mt-10 sm:mt-12">
            <div className="flex flex-col gap-6 border-t border-[var(--rule)] pt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:pt-10">
              <p className="max-w-[52ch] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
                Cette solution est un point de départ. On l&apos;adapte à votre
                façon de travailler après en avoir parlé avec vous.
              </p>

              <Link
                href="/demarrer-un-projet"
                className="inline-flex shrink-0 items-center self-start border-b border-[var(--ink)] pb-1 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--ink-body)] transition-colors duration-200 ease-out hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] sm:self-auto"
              >
                En parler avec nous
              </Link>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </main>
  );
}
