import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Rise } from '@/components/motion/Rise';
import { Trace } from '@/components/motion/Trace';
import { methodContent } from '@/lib/content/method';

/**
 * La méthode en quatre étapes, juste après les problèmes : ce qu'on fait,
 * dans l'ordre, et ce que le client peut vérifier à la fin.
 *
 * Une frise : horizontale à partir de `lg`, verticale en dessous. Les
 * étapes sont reliées par un filet vermillon qui se dessine à son entrée
 * dans le viewport (Trace) — d'un seul trait en desktop, segment par
 * segment en mobile, où chaque étape entre à son tour. Sans JS ou avec
 * « réduire les animations », le filet est déjà tracé.
 *
 * Sous la frise, un bloc compact « Comment nous travaillons ensemble »
 * (trois colonnes, aucun prix) et la ligne des outils qu'on branche :
 * elle remplace l'ancienne section Intégrations.
 *
 * Textes : lib/content/method.ts.
 */
export function Method() {
  const { anchor, eyebrow, title, steps, collaboration, tools, cta } =
    methodContent;

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
            className="mt-5 max-w-[20ch] text-balance"
            lead={title.lead}
            voice={title.voice}
          />
        </Rise>

        <ol className="relative mt-14 grid grid-cols-1 gap-12 sm:mt-16 lg:grid-cols-4 lg:gap-8">
          {/* Le trait de la frise en desktop : il passe par le centre des
              quatre jalons, du premier au dernier. */}
          <Trace
            tone="accent"
            className="absolute top-[7px] right-[calc((100%-6rem)/4-7px)] left-[7px] hidden lg:block"
          />

          {steps.map((step, index) => (
            <Rise
              as="li"
              key={step.id}
              order={index}
              className="relative pl-10 lg:pl-0 lg:pt-12"
            >
              {/* Mobile : un segment du jalon courant au suivant (le
                  `gap-12` de la liste compris). */}
              {index < steps.length - 1 && (
                <Trace
                  axis="y"
                  tone="accent"
                  className="absolute top-[15px] -bottom-12 left-[7px] lg:hidden"
                />
              )}

              {/* Le jalon : un anneau vermillon sur le fond, posé sur le
                  trait. */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 block size-[15px] rounded-full border border-accent bg-paper"
              />

              <span
                aria-hidden="true"
                className="block font-sans text-label tracking-tag text-accent"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-3 font-heading text-subtitle">{step.title}</h3>

              <p className="mt-4 text-body text-ink-body">{step.summary}</p>

              <ul className="mt-5 flex flex-col gap-3 border-t border-rule pt-5">
                {step.points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-4 text-[0.9375rem] leading-[1.5] text-ink-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.7em] left-0 block h-px w-2 bg-ink-muted"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Rise>
          ))}
        </ol>

        {/* Comment nous travaillons ensemble : trois colonnes compactes,
            sans prix. */}
        <Rise className="mt-16 rounded-card border border-rule bg-surface p-6 sm:mt-20 sm:p-8">
          <h3 className="font-sans text-label uppercase tracking-tag text-ink-muted">
            {collaboration.title}
          </h3>

          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {collaboration.items.map((item) => (
              <li key={item.title}>
                <h4 className="font-heading text-[1.25rem] leading-[1.2] font-bold text-ink">
                  {item.title}
                </h4>
                <p className="mt-2 text-[0.9375rem] leading-[1.55] text-ink-body">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>

          {/* Les outils cités sont ceux qu'on sait brancher ; la note ne
              promet rien de plus. */}
          <p className="mt-8 border-t border-rule pt-5 text-[0.875rem] leading-[1.55] text-ink-muted">
            <span className="text-ink-body">{tools.label} :</span>{' '}
            {tools.names.join(', ')}. {tools.note}
          </p>
        </Rise>

        <Rise className="mt-10 sm:mt-12">
          <Button href={cta.href}>{cta.label}</Button>
        </Rise>
      </SectionShell>
    </section>
  );
}
