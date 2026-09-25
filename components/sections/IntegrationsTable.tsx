import { SectionShell } from '@/components/SectionShell';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { connectedTools } from '@/lib/content/tools';

/**
 * Les intégrations, en tableau.
 *
 * Le carrousel défilant a disparu : une bande de logos qui glisse toute
 * seule est précisément l'effet que la direction supprime — elle occupe
 * l'œil sans rien dire, et on ne peut pas lire une liste qui bouge. Ici
 * les dix outils tiennent en deux colonnes, chacun sur sa ligne, séparés
 * au filet. Le composant s'appelait `IntegrationsMarquee` ; il n'y a plus
 * de marquee.
 */

export function IntegrationsTable() {
  const dernier = connectedTools.length - 1;

  return (
    <section
      id="outils"
      aria-label="Intégrations"
      className="border-t border-rule bg-paper text-ink"
    >
      <SectionShell className="py-16 sm:py-20 lg:py-24">
        {/* Sur desktop le paragraphe se pose à droite du titre, aligné sur
            sa dernière ligne ; en mobile il repasse dessous. */}
        <Reveal
          preset="soft"
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div className="lg:flex-1">
            <span className="block font-sans text-label uppercase text-accent">
              Intégrations
            </span>

            <h2 className="mt-5 font-heading text-title text-ink">
              On ne remplace rien.
              <span className="block font-serif text-[1.06em] font-normal italic tracking-[-0.02em]">
                On relie.
              </span>
            </h2>
          </div>

          <p className="max-w-[46ch] text-body text-ink-body lg:shrink-0 lg:basis-[34%] lg:pb-2">
            Vos logiciels actuels restent en place. On les fait communiquer
            entre eux, et on ajoute seulement ce qui manque.
          </p>
        </Reveal>

        <p className="mt-14 font-sans text-label uppercase text-ink-muted sm:mt-16">
          Ce qu&apos;on relie chez vous
        </p>

        {/* Deux colonnes remplies par lignes, dans l'ordre du tableau. Les
            deux dernières cellules ferment leur colonne d'un filet bas ;
            en mobile, où il n'y a qu'une colonne, seule la dernière le
            porte. */}
        <Stagger gap={0.04} className="mt-6 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12 lg:gap-x-20">
          {connectedTools.map((tool, index) => (
            <StaggerItem key={tool.name}>
              <div
                className={[
                  'flex items-baseline justify-between gap-4 border-t border-rule py-4',
                  index === dernier ? 'border-b' : '',
                  index === dernier - 1 ? 'sm:border-b' : '',
                ].join(' ')}
              >
                <span className="font-sans text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
                  {tool.name}
                </span>

                <span className="shrink-0 font-sans text-label uppercase tracking-tag text-ink-muted">
                  {tool.role}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal preset="soft" className="mt-12 sm:mt-14">
          <p className="max-w-[62ch] text-lead text-ink-body">
            Votre logiciel métier n&apos;est pas dans la liste ? S&apos;il
            expose une API, il se branche — et la plupart en exposent une.{' '}
            <span className="font-serif italic text-ink">
              Dites-nous lequel, on vous répond franchement.
            </span>
          </p>
        </Reveal>
      </SectionShell>
    </section>
  );
}
