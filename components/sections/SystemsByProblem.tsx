import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { systemOffers, type SystemOffer } from '@/lib/content/systems';

function OfferRow({ offer, index }: { offer: SystemOffer; index: number }) {
  return (
    <article
      id={offer.id}
      className="offer-row group relative scroll-mt-28 py-9 sm:py-11"
    >
      {/* Filet d'accent qui se déploie de haut en bas au survol : c'est lui
          qui relie visuellement les deux colonnes et occupe le vide à
          gauche des phrases courtes. */}
      <span
        aria-hidden="true"
        className="offer-row__rule pointer-events-none absolute left-0 top-0 hidden w-px bg-gradient-to-b from-[#7CC7FF] to-[#7CC7FF]/0 lg:block"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* La situation, dans les mots du dirigeant */}
        <div className="flex gap-4 sm:gap-5 lg:pl-6">
          <span
            aria-hidden="true"
            className="mt-[0.55rem] shrink-0 font-[family-name:var(--font-ibm-plex-mono)] text-[0.68rem] tabular-nums text-[#8E98A3] transition-colors duration-300 group-hover:text-[#7CC7FF]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <h3 className="max-w-[22ch] font-[family-name:var(--font-sora)] text-[clamp(1.35rem,4.2vw,1.8rem)] font-medium leading-[1.24] tracking-[-0.035em] text-[#F4F7FA]">
            <span className="text-[#8E98A3]/70">«&nbsp;</span>
            {offer.situation}
            <span className="text-[#8E98A3]/70">&nbsp;»</span>
          </h3>
        </div>

        {/* Ce qu'on installe */}
        <div className="lg:border-l lg:border-[#2A333C] lg:pl-14 lg:transition-colors lg:duration-300 lg:group-hover:border-[#7CC7FF]/30">
          <p className="text-[1rem] leading-7 text-[#E3E9EF] sm:text-[1.06rem]">
            {offer.delivers}
          </p>

          <ul className="mt-5 space-y-2.5">
            {offer.includes.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[0.9rem] leading-6 text-[#8E98A3] sm:text-[0.94rem]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[#7CC7FF]/60 transition-colors duration-300 group-hover:bg-[#7CC7FF]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function SystemsByProblem() {
  return (
    <section
      id="systems"
      aria-label="Ce que nous résolvons"
      className="border-t border-[#151C23]"
    >
      <SectionShell className="py-14 sm:py-16 lg:py-20">
        <Reveal className="section-aura mx-auto max-w-[720px] text-center">
          <SectionLabel>Ce que nous résolvons</SectionLabel>

          <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(1.9rem,6.5vw,3.1rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#F4F7FA] sm:mt-5">
            Quatre symptômes. Une seule cause.
          </h2>

          <p className="mx-auto mt-5 max-w-[560px] text-[0.98rem] leading-7 text-[#CDD5DD]">
            Vous vous reconnaîtrez sûrement dans l&apos;une de ces phrases. Elles
            ont toutes la même origine : des outils qui ne se parlent pas. On ne
            vous en vend pas un de plus — on relie ceux que vous avez.
          </p>
        </Reveal>

        <Stagger
          gap={0.09}
          className="mt-12 divide-y divide-[#2A333C] border-y border-[#2A333C] sm:mt-14 lg:mt-16"
        >
          {systemOffers.map((offer, index) => (
            <StaggerItem key={offer.id}>
              <OfferRow offer={offer} index={index} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal preset="soft" className="pt-9 sm:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <p className="max-w-[520px] text-[0.95rem] leading-7 text-[#8E98A3]">
              Aucune de ces quatre situations ne ressemble à la vôtre ? C&apos;est
              fréquent, et ça vaut une conversation plutôt qu&apos;un formulaire.
            </p>

            <ButtonSecondary
              href="/contact"
              arrow="right"
              className="min-h-12 w-full justify-center px-6 sm:w-auto"
            >
              Décrivez-nous votre situation
            </ButtonSecondary>
          </div>
        </Reveal>
      </SectionShell>
    </section>
  );
}
