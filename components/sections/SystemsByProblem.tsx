import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { systemOffers } from '@/lib/content/systems';
import { BOOKING_URL } from '@/lib/content/contact';
import { Button } from '@/components/ui/Button';
import { Rise } from '@/components/motion/Rise';
import { Trace } from '@/components/motion/Trace';

/**
 * Les quatre phrases de dirigeant, et rien d'autre.
 *
 * Ce qu'on installe vit dans le catalogue, juste en dessous, où il est à
 * sa place. Ici on ne cherche qu'une chose — que le lecteur se
 * reconnaisse dans une phrase.
 *
 * Les quatre lignes apparaissent au défilement, en cascade (Rise) ;
 * les filets de 1px font la séparation.
 */

export function SystemsByProblem() {
  return (
    <section
      id="systems"
      aria-label="Ce que nous résolvons"
      className="bg-paper text-ink"
    >
      <Trace />

      <SectionShell className="py-section">
        <Rise>
          <div>
            <Eyebrow>Ce que nous résolvons</Eyebrow>

            {/* La seconde phrase bascule dans la voix, mais reste à
                l'encre — le vermillon est déjà pris par le sur-titre. */}
            {/* La limite est sur le titre, en `ch` de SA taille : posée sur
                l'enveloppe, 24ch du texte courant (≈ 216px) coupaient le
                titre mot par mot. */}
            <SectionTitle
              className="mt-5 max-w-[16ch]"
              lead="Quatre symptômes."
              voice="Une seule cause."
            />
          </div>

          <p className="mt-7 max-w-measure text-body text-ink-body">
            Vous vous reconnaîtrez sûrement dans l&apos;une de ces phrases. Elles
            ont toutes la même origine : des outils qui ne se parlent pas. On ne
            vous en vend pas un de plus — on relie ceux que vous avez.
          </p>
        </Rise>

        {/* Quatre lignes, filet en haut de chacune, filet en bas de la
            dernière. La colonne de gauche tient le nom court du symptôme,
            celle de droite la phrase citée. */}
        <div className="mt-14 border-b border-rule sm:mt-16">
          {systemOffers.map((offer, index) => (
            <Rise key={offer.id} order={index}>
              <div
                id={offer.id}
                className="grid scroll-mt-28 grid-cols-1 gap-2 border-t border-rule py-8 sm:grid-cols-[210px_1fr] sm:gap-6 sm:py-10"
              >
                <span className="font-sans text-label uppercase tracking-tag text-ink-muted sm:pt-4">
                  {offer.shortLabel}
                </span>

                <p className="font-serif text-[clamp(1.75rem,7vw,2.875rem)] italic leading-[1.1] text-ink">
                  «&nbsp;{offer.situation}&nbsp;»
                </p>
              </div>
            </Rise>
          ))}
        </div>

        <Rise className="pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <p className="max-w-measure text-body text-ink-body">
              Aucune de ces quatre situations ne ressemble à la vôtre ? C&apos;est
              fréquent, et ça vaut une conversation plutôt qu&apos;un formulaire.
            </p>

            {/* La phrase juste au-dessus promet une conversation ; elle
                renvoyait pourtant au formulaire. Ce lien tient désormais
                la promesse et ouvre un créneau de quinze minutes. */}
            <Button
              href={BOOKING_URL}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 self-start sm:self-auto"
            >
              Réserver un appel
              <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
            </Button>
          </div>
        </Rise>
      </SectionShell>
    </section>
  );
}
