import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

/**
 * La clôture. Le titre ne demande plus si le lecteur est « prêt » — il
 * dit ce qu'on fait, dans les mots déjà employés sur les fiches solution :
 * on part de la situation du client, pas d'un modèle tout fait.
 */

export function FinalCTA() {
  return (
    <section className="border-t border-rule bg-paper text-ink">
      <SectionShell className="py-16 sm:py-20 lg:py-24">
        <Stagger
          gap={0.09}
          className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <StaggerItem preset="soft" className="lg:flex-1">
            <span className="block font-sans text-label uppercase text-accent">
              Prochaines étapes
            </span>

            {/* 72px · lh 0.98 · tracking -0.038em · 800. */}
            <h2 className="mt-5 font-heading text-title text-ink">
              On part de votre situation,
              <span className="block font-serif text-[1.07em] font-normal italic tracking-[-0.02em] text-accent">
                pas d&apos;un modèle tout fait.
              </span>
            </h2>
          </StaggerItem>

          <StaggerItem preset="soft" className="w-full lg:w-auto lg:shrink-0 lg:pb-3">
            <Link
              href="/demarrer-un-projet"
              className="inline-flex min-h-12 w-full items-center justify-center bg-accent px-7 font-sans text-[0.9375rem] font-semibold text-on-accent transition-colors duration-200 ease-out hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:w-auto"
            >
              Démarrer un projet
            </Link>
          </StaggerItem>
        </Stagger>
      </SectionShell>
    </section>
  );
}
