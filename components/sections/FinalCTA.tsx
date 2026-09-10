import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { SectionShell } from '@/components/SectionShell';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Magnetic } from '@/components/motion/Magnetic';

export function FinalCTA() {
  return (
    <SectionShell className="py-12 sm:py-14 lg:py-16">
      <Stagger
        gap={0.09}
        className="section-aura mx-auto max-w-[760px] space-y-4 px-1 text-center sm:space-y-5"
      >
        <StaggerItem preset="soft">
          <div className="text-[0.6rem] font-medium uppercase tracking-[0.17em] text-[#8E98A3] sm:text-[0.68rem] sm:tracking-[0.2em]">
            Prochaines étapes
          </div>
        </StaggerItem>

        <StaggerItem preset="default">
          <h2 className="font-[family-name:var(--font-sora)] text-[clamp(1.9rem,7vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-[#F4F7FA] sm:text-[clamp(2.3rem,5vw,3rem)] sm:leading-[1.05]">
            Prêt à construire votre système intelligent ?
          </h2>
        </StaggerItem>

        <StaggerItem preset="soft">
          <div className="flex justify-center pt-2 sm:pt-3">
            <Magnetic className="flex w-full sm:w-auto" strength={7}>
              <ButtonPrimary
                href="/demarrer-un-projet"
                className="min-h-12 w-full justify-center px-6 shadow-[0_0_0_1px_rgba(124,199,255,0.10)] sm:w-auto"
              >
                Démarrer un projet
              </ButtonPrimary>
            </Magnetic>
          </div>
        </StaggerItem>
      </Stagger>
    </SectionShell>
  );
}
