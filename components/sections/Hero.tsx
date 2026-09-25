import { SectionShell } from '@/components/SectionShell';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HeroFlow } from '@/components/hero/HeroFlow';
import { heroContent } from '@/lib/content/hero';

/**
 * Le Hero : le titre en deux voix, ce qu'on fait en une phrase, et les
 * deux portes d'entrée. Ses textes viennent de lib/content/hero.ts.
 *
 * À droite en desktop (titre ≈ 5/12, flux ≈ 7/12), sous les CTA en
 * mobile : la démonstration, où une demande réelle traverse le flux
 * (components/hero/HeroFlow.tsx).
 *
 * Rien ici n'est animé à l'entrée : le h1 est l'élément LCP et doit
 * s'afficher au premier rendu. La démonstration part de l'état final de
 * son premier scénario, rendu côté serveur à sa hauteur définitive.
 *
 * Le bandeau des quatre mentions (« Plus de demandes »…) a disparu :
 * quatre promesses sans preuve, que la démonstration remplace.
 */
export function Hero() {
  const { title, intro, ctas } = heroContent;

  return (
    <div className="bg-paper text-ink">
      <SectionShell className="pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pt-24 lg:pb-24">
        <div className="lg:col-span-5">
          {/* La seconde phrase bascule dans la voix, en vermillon. */}
          <SectionTitle
            as="h1"
            size="display"
            voiceTone="accent"
            lead={title.lead}
            voice={title.voice}
            className="lg:text-display-split"
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
        </div>

        <div className="mt-16 sm:mt-20 lg:col-span-7 lg:mt-0 lg:pl-8">
          <HeroFlow />
        </div>
      </SectionShell>
    </div>
  );
}
