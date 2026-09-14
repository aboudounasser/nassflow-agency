import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionShell } from '@/components/SectionShell';
import { SectionLabel } from '@/components/SectionLabel';
import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
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
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <SectionShell className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[820px] px-1 sm:px-0">
          <Reveal onMount>
            {/* Même motif de retour que /demarrer-un-projet,
                pointé sur l'ancre du catalogue plutôt que sur le haut de
                la home : on revient là d'où l'on vient. */}
            <Link
              href="/#solutions"
              className="group mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-[#8E98A3] transition-colors hover:text-[#7CC7FF] sm:mb-14"
            >
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
              >
                ←
              </span>
              Retour aux solutions
            </Link>

            <SectionLabel>{solution.categoryLabel}</SectionLabel>

            <h1 className="mt-5 max-w-[680px] font-[family-name:var(--font-sora)] text-[clamp(2rem,8vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-[#F4F7FA] sm:mt-6">
              {solution.title}
            </h1>

            {/* La phrase du dirigeant, citée comme sur la home. */}
            <p className="mt-5 max-w-[560px] text-[1.05rem] leading-7 text-[#8E98A3] sm:mt-6">
              <span className="text-[#8E98A3]/70">«&nbsp;</span>
              {solution.problem}
              <span className="text-[#8E98A3]/70">&nbsp;»</span>
            </p>
          </Reveal>

          <Reveal preset="soft" delay={0.12} className="mt-10 sm:mt-12">
            <div className="rounded-[1.25rem] border border-[#2A333C] bg-[#10161D]/70 p-6 sm:rounded-[1.5rem] sm:p-8">
              <h2 className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                Ce qu&apos;on installe
              </h2>

              <p className="mt-4 text-[1.05rem] leading-7 text-[#E3E9EF] sm:text-[1.1rem]">
                {solution.delivers}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[#2A333C] pt-6">
                {solution.includes.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.95rem] leading-6 text-[#CDD5DD]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[#7CC7FF]/60"
                    />
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
            <h2 className="font-[family-name:var(--font-sora)] text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-[#F4F7FA]">
              Dites-nous où vous en êtes
            </h2>

            <p className="mt-3 max-w-[520px] text-[0.95rem] leading-7 text-[#8E98A3]">
              On part de votre situation, pas d&apos;un modèle tout fait.
            </p>

            <div className="mt-8 sm:mt-10">
              <SolutionRequestForm solution={solution} />
            </div>
          </Reveal>

          <Reveal preset="soft" delay={0.24} className="mt-10 sm:mt-12">
            <div className="flex flex-col gap-5 border-t border-[#2A333C] pt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-10">
              <p className="max-w-[460px] text-[0.95rem] leading-7 text-[#8E98A3]">
                Cette solution est un point de départ. On l&apos;adapte à votre
                façon de travailler après en avoir parlé avec vous.
              </p>

              <ButtonSecondary
                href="/demarrer-un-projet"
                arrow="right"
                className="min-h-12 w-full justify-center px-6 sm:w-auto"
              >
                En parler avec nous
              </ButtonSecondary>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </main>
  );
}
