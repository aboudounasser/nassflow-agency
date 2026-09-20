import { SectionShell } from '@/components/SectionShell';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { systemOffers } from '@/lib/content/systems';
import { BOOKING_URL } from '@/lib/content/contact';

/**
 * Les quatre phrases de dirigeant, et rien d'autre.
 *
 * La section ne montre plus `delivers` ni `includes` : ce détail vit dans
 * le catalogue, juste en dessous, où il est à sa place. Ici on ne cherche
 * qu'une chose — que le lecteur se reconnaisse dans une phrase. Les deux
 * champs restent définis dans `lib/content/systems.ts`, où ils servent de
 * référence d'écriture même si plus rien ne les rend pour l'instant.
 *
 * Voir l'en-tête de `app/globals.css` pour la direction : filets 1px,
 * aucun arrondi, aucun effet.
 */

export function SystemsByProblem() {
  return (
    <section
      id="systems"
      aria-label="Ce que nous résolvons"
      className="border-t border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]"
    >
      <SectionShell className="py-16 sm:py-20 lg:py-24">
        <Reveal preset="soft" className="max-w-[24ch]">
          {/* Sur-titre : 11px · 600 · 0.2em · majuscules · accent. */}
          <span className="block font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Ce que nous résolvons
          </span>

          {/* h2 : 64px · lh 1.0 · tracking -0.035em · 800. La seconde
              phrase bascule dans la voix, mais reste à l'encre — le
              vermillon est déjà pris par le sur-titre. */}
          <h2 className="mt-5 font-[family-name:var(--font-archivo)] text-[clamp(2.125rem,6.4vw,4rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-[var(--ink)]">
            Quatre symptômes.
            <span className="block font-[family-name:var(--font-serif)] text-[1.06em] font-normal italic tracking-[-0.02em]">
              Une seule cause.
            </span>
          </h2>
        </Reveal>

        <p className="mt-7 max-w-[62ch] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
          Vous vous reconnaîtrez sûrement dans l&apos;une de ces phrases. Elles
          ont toutes la même origine : des outils qui ne se parlent pas. On ne
          vous en vend pas un de plus — on relie ceux que vous avez.
        </p>

        {/* Quatre lignes, filet en haut de chacune, filet en bas de la
            dernière. La colonne de gauche tient le nom court du symptôme,
            celle de droite la phrase citée. */}
        <Stagger
          gap={0.09}
          className="mt-14 border-b border-[var(--rule)] sm:mt-16"
        >
          {systemOffers.map((offer) => (
            <StaggerItem key={offer.id}>
              <div
                id={offer.id}
                className="grid scroll-mt-28 grid-cols-1 gap-2 border-t border-[var(--rule)] py-8 sm:grid-cols-[210px_1fr] sm:gap-6 sm:py-10"
              >
                <span className="font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] sm:pt-4">
                  {offer.shortLabel}
                </span>

                <p className="font-[family-name:var(--font-serif)] text-[clamp(1.75rem,7vw,2.875rem)] italic leading-[1.1] text-[var(--ink)]">
                  «&nbsp;{offer.situation}&nbsp;»
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal preset="soft" className="pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <p className="max-w-[52ch] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
              Aucune de ces quatre situations ne ressemble à la vôtre ? C&apos;est
              fréquent, et ça vaut une conversation plutôt qu&apos;un formulaire.
            </p>

            {/* La phrase juste au-dessus promet une conversation ; elle
                renvoyait pourtant au formulaire. Ce lien tient désormais
                la promesse et ouvre un créneau de trente minutes. */}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center self-start border-b border-[var(--ink)] pb-1 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--ink-body)] transition-colors duration-200 ease-out hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] sm:self-auto"
            >
              Réserver 30 minutes pour en parler
              <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
            </a>
          </div>
        </Reveal>
      </SectionShell>
    </section>
  );
}
