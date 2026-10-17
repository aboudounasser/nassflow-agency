import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Trace } from '@/components/motion/Trace';
import { Rise } from '@/components/motion/Rise';
import { DemoConsole } from '@/components/demo/DemoConsole';
import { demoContent } from '@/lib/content/demo';

/**
 * La démonstration en direct, juste sous le Hero : la cible du CTA
 * « Voir une démonstration » (`#demonstration`). Le visiteur écrit comme
 * un prospect, un agent IA traite la demande sous ses yeux.
 *
 * Le titre est rendu ici, côté serveur ; il reçoit le focus quand on
 * arrive par le CTA (`tabIndex={-1}`, voir DemoConsole). Tout
 * l'interactif vit dans components/demo/. Textes : lib/content/demo.ts.
 */
export function Demo() {
  const { anchor, eyebrow, title, intro } = demoContent;

  // « Regardez-la » ne se coupe pas sur son trait d'union.
  const [first, ...rest] = title.voice.split(' ');

  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-titre`}
      className="bg-paper text-ink"
    >
      <Trace />

      <SectionShell className="py-section">
        <DemoConsole
          header={
            <Rise>
              <Eyebrow as="p">{eyebrow}</Eyebrow>

              {/* Le titre de la section, sans halo au focus : un focus posé
                  par programme (arrivée par le CTA) n'est pas
                  `:focus-visible` à la souris, mais l'est au clavier. */}
              <SectionTitle
                id={`${anchor}-titre`}
                tabIndex={-1}
                lead={title.lead}
                voice={
                  <>
                    <span className="whitespace-nowrap">{first}</span> {rest.join(' ')}
                  </>
                }
                className="mt-5 max-w-[16ch] text-balance outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
              />

              <p className="mt-7 max-w-measure text-body text-ink-body">{intro}</p>
            </Rise>
          }
        />
      </SectionShell>
    </section>
  );
}
