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
 * Textes : lib/content/method.ts.
 */
export function Method() {
  const { anchor, eyebrow, title, steps, cta } = methodContent;

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

        <Rise className="mt-14 sm:mt-16">
          <Button href={cta.href}>{cta.label}</Button>
        </Rise>
      </SectionShell>
    </section>
  );
}
