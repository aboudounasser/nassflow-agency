import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Rise } from '@/components/motion/Rise';
import { Trace } from '@/components/motion/Trace';
import { problemsContent } from '@/lib/content/problems';

/**
 * Ce qui coûte des ventes : quatre situations dans lesquelles un
 * dirigeant de PME B2B reconnaît son équipe commerciale. Elle remplace
 * l'ancienne section « Quatre symptômes. » (#systems).
 *
 * Les cartes reprennent le survol du catalogue (montée de 4 px, filet
 * éclairci, ombre douce) ; elles ne mènent nulle part, elles ne sont donc
 * pas des liens. Numéro discret 01 à 04, masqué aux lecteurs d'écran :
 * la liste ordonnée le dit déjà.
 *
 * Textes : lib/content/problems.ts.
 */
export function Problems() {
  const { anchor, eyebrow, title, items } = problemsContent;

  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-titre`}
      className="bg-paper text-ink"
    >
      <Trace />

      <SectionShell className="py-section">
        <Rise>
          <Eyebrow as="p">{eyebrow}</Eyebrow>

          <SectionTitle
            id={`${anchor}-titre`}
            className="mt-5 max-w-[18ch] text-balance"
            lead={title.lead}
            voice={title.voice}
          />
        </Rise>

        <ol className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {items.map((item, index) => (
            <Rise as="li" key={item.id} order={index} className="flex">
              <div
                className="flex w-full flex-col rounded-card border border-rule bg-surface p-6 transition-[transform,border-color,box-shadow] duration-(--motion-duration-base) hover:-translate-y-1 hover:border-rule-strong hover:shadow-card sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="font-sans text-label tracking-tag text-ink-muted"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-6 font-heading text-subtitle">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-measure text-body text-ink-body">
                  {item.description}
                </p>
              </div>
            </Rise>
          ))}
        </ol>
      </SectionShell>
    </section>
  );
}
