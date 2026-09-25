import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';

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
            <Eyebrow>Prochaines étapes</Eyebrow>

            <SectionTitle
              className="mt-5"
              lead="On part de votre situation,"
              voice="pas d'un modèle tout fait."
              voiceTone="accent"
            />
          </StaggerItem>

          <StaggerItem preset="soft" className="w-full lg:w-auto lg:shrink-0 lg:pb-3">
            <Button href="/demarrer-un-projet" className="w-full lg:w-auto">
              Démarrer un projet
            </Button>
          </StaggerItem>
        </Stagger>
      </SectionShell>
    </section>
  );
}
