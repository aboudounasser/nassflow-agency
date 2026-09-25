import { SectionShell } from '@/components/SectionShell';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { heroContent } from '@/lib/content/hero';

/**
 * Le Hero : le titre en deux voix, ce qu'on fait en une phrase, et les
 * deux portes d'entrée. Ses textes viennent de lib/content/hero.ts.
 *
 * Rien ici n'est animé à l'entrée : le h1 est l'élément LCP et doit
 * s'afficher au premier rendu.
 *
 * Le bandeau des quatre mentions (« Plus de demandes »…) a disparu :
 * quatre promesses sans preuve, que la démonstration remplace.
 */
export function Hero() {
  const { title, intro, ctas } = heroContent;

  return (
    <div className="bg-paper text-ink">
      <SectionShell className="pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        {/* La seconde phrase bascule dans la voix, en vermillon. */}
        <SectionTitle
          as="h1"
          size="display"
          voiceTone="accent"
          lead={title.lead}
          voice={title.voice}
        />

        <p className="mt-8 max-w-[58ch] text-body text-ink-body sm:text-lead">
          {intro}
        </p>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Button href={ctas.primary.href} className="w-full sm:w-auto">
            {ctas.primary.label}
          </Button>

          <Button href={ctas.secondary.href} variant="secondary">
            {ctas.secondary.label}
          </Button>
        </div>
      </SectionShell>
    </div>
  );
}
