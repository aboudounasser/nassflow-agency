import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';

export function ProblemSection() {
  return (
    <SectionShell className="py-16 sm:py-20 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div>
          <SectionLabel>Le problème</SectionLabel>

          <h2 className="mt-6 max-w-[520px] font-[family-name:var(--font-sora)] text-[clamp(2.1rem,4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#F4F7FA]">
            Les outils sont dispersés. L’activité l’est aussi.
          </h2>

          <div className="mt-6 space-y-5 text-base leading-7 text-[#CDD5DD] sm:text-lg">
            <p>
              Les entreprises accumulent des outils, des tâches répétitives et des informations fragmentées.
              Les décisions prennent du temps, les réponses sont lentes et les processus ne communiquent pas entre eux.
            </p>
            <p>
              Le vrai problème n’est pas seulement l’absence d’outils. C’est la fragmentation du système.
              Un site isolé, un chatbot séparé, une automatisation sans lien, des données dispersées : tout cela ralentit l’entreprise.
            </p>
          </div>

          <div className="mt-8">
            <ButtonSecondary href="#approach">Voir notre approche</ButtonSecondary>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-8 top-0 h-28 rounded-full bg-[#7CC7FF]/10 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#2A333C] bg-[#10161D]/90 p-4 shadow-[0_0_0_1px_rgba(42,51,60,0.2),0_24px_80px_rgba(0,0,0,0.32)] sm:p-5 lg:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(124,199,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,199,255,0.06) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative">
              <div className="mb-5 flex items-center justify-between border-b border-[#2A333C] pb-3">
                <span className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                  fragmentation
                </span>
                <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#A9D9FF]">
                  systèmes isolés
                </span>
              </div>

              <div className="relative h-[22rem] overflow-hidden rounded-[1.25rem] border border-[#2A333C] bg-[#0A0D12] p-3 sm:h-[24rem]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 600 420"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <linearGradient id="brokenFlow" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="rgba(124,199,255,0)" />
                      <stop offset="30%" stopColor="rgba(124,199,255,0.25)" />
                      <stop offset="65%" stopColor="rgba(147,167,255,0.24)" />
                      <stop offset="100%" stopColor="rgba(124,199,255,0)" />
                    </linearGradient>
                  </defs>

                  <path d="M 100 115 L 220 115" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 220 115 L 360 180" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 360 180 L 500 180" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 110 290 L 250 230" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 250 230 L 420 230" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 420 230 L 500 310" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 220 115 L 220 230" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                  <path d="M 360 180 L 360 310" stroke="url(#brokenFlow)" strokeWidth="2" fill="none" strokeDasharray="8 10" />
                </svg>

                <div className="absolute left-5 top-6 rounded-[1.1rem] border border-[#2A333C] bg-[#141B22] px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                  <div className="flex items-center gap-2 text-[0.54rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2A333C]" />
                    CRM
                  </div>
                  <div className="mt-3 h-2.5 w-16 rounded-full bg-[#2A333C]" />
                </div>

                <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-[1.1rem] border border-[#2A333C] bg-[#141B22] px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                  <div className="flex items-center gap-2 text-[0.54rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2A333C]" />
                    IA
                  </div>
                  <div className="mt-3 h-2.5 w-12 rounded-full bg-[#2A333C]" />
                </div>

                <div className="absolute right-5 top-[5.25rem] rounded-[1.1rem] border border-[#2A333C] bg-[#141B22] px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                  <div className="flex items-center gap-2 text-[0.54rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2A333C]" />
                    Site
                  </div>
                  <div className="mt-3 h-2.5 w-14 rounded-full bg-[#2A333C]" />
                </div>

                <div className="absolute left-6 bottom-7 rounded-[1.1rem] border border-[#2A333C] bg-[#141B22] px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                  <div className="flex items-center gap-2 text-[0.54rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2A333C]" />
                    Ops
                  </div>
                  <div className="mt-3 h-2.5 w-14 rounded-full bg-[#2A333C]" />
                </div>

                <div className="absolute bottom-6 right-8 rounded-[1.1rem] border border-[#2A333C] bg-[#141B22] px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                  <div className="flex items-center gap-2 text-[0.54rem] font-medium uppercase tracking-[0.18em] text-[#8E98A3]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2A333C]" />
                    outils
                  </div>
                  <div className="mt-3 h-2.5 w-12 rounded-full bg-[#2A333C]" />
                </div>

                <div className="absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border border-[#2A333C] bg-[#10161D]/95 px-4 py-4 shadow-[0_0_24px_rgba(124,199,255,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.58rem] uppercase tracking-[0.18em] text-[#8E98A3]">système</span>
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#7CC7FF] shadow-[0_0_16px_rgba(124,199,255,0.65)]" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2.5 w-16 rounded-full bg-[#7CC7FF]/80" />
                    <div className="h-2 w-20 rounded-full bg-[#2A333C]" />
                    <div className="h-2 w-12 rounded-full bg-[#2A333C]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
