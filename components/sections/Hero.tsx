import { SectionShell } from '@/components/SectionShell';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HeroFlow } from '@/components/hero/HeroFlow';
import { heroContent } from '@/lib/content/hero';

/**
 * Le Hero : la cible en sur-titre, le titre en deux voix, ce qu'on fait
 * en une phrase, et les deux portes d'entrée. Ses textes viennent de lib/content/hero.ts.
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
 *
 * Derrière, trois halos flous (vermillon, ambre, indigo profond) dérivent
 * lentement : CSS seul, `transform` et `opacity` uniquement, un cycle de
 * 24 s ou plus (`drift`, lib/motion.ts). Ils sont immobiles sans JS et
 * avec « réduire les animations ». Leurs opacités sont réglées pour que
 * le titre garde son contraste sur la zone la plus claire.
 */
function HeroHalos() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <span
        data-halo="1"
        className="halo top-[-20%] right-[-15%] size-[70vmax] [--halo:var(--halo-accent)]"
      />
      <span
        data-halo="2"
        className="halo bottom-[-35%] left-[-20%] size-[60vmax] [--halo:var(--halo-amber)]"
      />
      <span
        data-halo="3"
        className="halo top-[-30%] left-[10%] size-[55vmax] [--halo:var(--halo-indigo)]"
      />
    </div>
  );
}

export function Hero() {
  const { eyebrow, title, intro, ctas, ctaNote } = heroContent;

  return (
    <div className="relative isolate bg-paper text-ink">
      <HeroHalos />

      <SectionShell className="pt-14 pb-section sm:pt-20 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pt-24">
        <div className="lg:col-span-5">
          <Eyebrow as="p" className="mb-6">
            {eyebrow}
          </Eyebrow>

          {/* La seconde phrase bascule dans la voix, en vermillon. */}
          <SectionTitle
            as="h1"
            size="display"
            voiceTone="accent"
            lead={title.lead}
            voice={title.voice}
            className="text-balance lg:text-display-split"
          />

          <p className="mt-8 max-w-measure text-body text-ink-body sm:text-lead">
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

          <p className="mt-6 max-w-[48ch] text-small text-ink-muted">{ctaNote}</p>
        </div>

        <div className="mt-16 sm:mt-20 lg:col-span-7 lg:mt-0 lg:pl-8">
          <HeroFlow />
        </div>
      </SectionShell>
    </div>
  );
}
