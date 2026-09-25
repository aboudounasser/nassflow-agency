import { SectionShell } from '@/components/SectionShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
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
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div data-reveal className="lg:flex-1">
            <Eyebrow>Prochaines étapes</Eyebrow>

            <SectionTitle
              className="mt-5"
              lead="On part de votre situation,"
              voice="pas d'un modèle tout fait."
              voiceTone="accent"
            />
          </div>

          <div data-reveal className="w-full lg:w-auto lg:shrink-0 lg:pb-3">
            <Button href="/demarrer-un-projet" className="w-full lg:w-auto">
              Démarrer un projet
            </Button>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
