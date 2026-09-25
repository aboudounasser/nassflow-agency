import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionShell } from '@/components/SectionShell';
import { SolutionRequestForm } from '@/components/sections/SolutionRequestForm';
import { solutions } from '@/lib/content/solutions';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

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

    // Sans ces deux blocs, les six fiches héritaient du openGraph du
    // layout : partagées sur WhatsApp ou LinkedIn, elles annonçaient
    // toutes le titre de l'accueil. L'image, elle, vient du fichier
    // `opengraph-image.tsx` voisin, que Next rattache tout seul.
    openGraph: {
      title: `${solution.title} — NASSFLOW AGENCY`,
      description: solution.delivers,
      url: `/solutions/${solution.slug}`,
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${solution.title} — NASSFLOW AGENCY`,
      description: solution.delivers,
    },
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
    <main id="contenu" className="flex-1">
      <SectionShell className="pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-[820px] px-1 sm:px-0">
          {/* Pas de lien « Retour aux solutions » ici : la navigation, juste
              au-dessus, porte déjà une entrée « Solutions » vers la même
              ancre. Deux liens identiques à quarante pixels l'un de l'autre
              n'aident personne. */}
          <div>
            <Eyebrow>{solution.categoryLabel}</Eyebrow>

            <h1 className="mt-5 font-heading text-title text-ink">
              {solution.title}
            </h1>

            {/* La phrase du dirigeant, citée comme sur la home. */}
            <p className="mt-6 max-w-[30ch] font-serif text-[1.75rem] italic leading-[1.25] text-ink-muted">
              «&nbsp;{solution.problem}&nbsp;»
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <div className="border-t border-rule pt-8">
              <Eyebrow as="h2" tone="muted">
                Ce qu&apos;on installe
              </Eyebrow>

              <p className="mt-5 max-w-[48ch] text-[1.375rem] leading-[1.4] text-ink">
                {solution.delivers}
              </p>

              <ul className="mt-10">
                {solution.includes.map((item) => (
                  <li
                    key={item}
                    className="border-t border-rule py-5 text-[1.0625rem] leading-[1.55] text-ink-body"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Le formulaire tire ses champs spécifiques de
              `solution.questions` et poste sur /api/solution-requests,
              qui écrit en service_role : la table refuse anon. */}
          <div data-reveal className="mt-12 sm:mt-16">
            <h2 className="font-heading text-heading text-ink">
              Dites-nous où vous en êtes
            </h2>

            <p className="mt-4 max-w-[52ch] text-body text-ink-body">
              On part de votre situation, pas d&apos;un modèle tout fait.
            </p>

            <div className="mt-8 sm:mt-10">
              <SolutionRequestForm solution={solution} />
            </div>
          </div>

          <div data-reveal className="mt-10 sm:mt-12">
            <div className="flex flex-col gap-6 border-t border-rule pt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:pt-10">
              <p className="max-w-[52ch] text-body text-ink-body">
                Cette solution est un point de départ. On l&apos;adapte à votre
                façon de travailler après en avoir parlé avec vous.
              </p>

              <Button
                href="/demarrer-un-projet"
                variant="secondary"
                className="shrink-0 self-start sm:self-auto"
              >
                En parler avec nous
              </Button>
            </div>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
