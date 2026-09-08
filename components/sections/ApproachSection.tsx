import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';

export function ApproachSection() {
  return (
    <section id="approach">
      <SectionShell className="py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div className="relative">
            <div className="absolute inset-x-12 top-10 h-24 rounded-full bg-[#7CC7FF]/10 blur-3xl" aria-hidden="true" />
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
                    architecture
                  </span>
                  <span className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#A9D9FF]">
                    système cohérent
                  </span>
                </div>

                <div className="relative h-[22rem] overflow-hidden rounded-[1.25rem] border border-[#2A333C] bg-[#0A0D12] p-3 sm:h-[24rem]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 620 430"
                    className="absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <linearGradient id="connectedFlow" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="rgba(124,199,255,0)" />
                        <stop offset="30%" stopColor="rgba(124,199,255,0.9)" />
                        <stop offset="60%" stopColor="rgba(147,167,255,0.9)" />
                        <stop offset="100%" stopColor="rgba(124,199,255,0)" />
                      </linearGradient>
                    </defs>

                    <path d="M 90 220 L 190 220 L 250 155 L 360 155 L 470 220" stroke="url(#connectedFlow)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 190 220 L 190 318 L 360 318 L 470 220" stroke="url(#connectedFlow)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 250 155 L 250 76 L 360 76 L 360 155" stroke="url(#connectedFlow)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 110 150 L 140 150" stroke="url(#connectedFlow)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <path d="M 510 200 L 540 200" stroke="url(#connectedFlow)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <path d="M 260 330 L 280 330" stroke="url(#connectedFlow)" strokeWidth="2.4" fill="none" strokeLinecap="round" />

                    <circle cx="90" cy="220" r="8" fill="#7CC7FF" fillOpacity="0.9" />
                    <circle cx="190" cy="220" r="8" fill="#93A7FF" fillOpacity="0.9" />
                    <circle cx="250" cy="155" r="8" fill="#7CC7FF" fillOpacity="0.9" />
                    <circle cx="360" cy="155" r="9" fill="#93A7FF" fillOpacity="0.95" />
                    <circle cx="470" cy="220" r="8" fill="#7CC7FF" fillOpacity="0.9" />
                    <circle cx="190" cy="318" r="8" fill="#7CC7FF" fillOpacity="0.8" />
                    <circle cx="360" cy="318" r="8" fill="#93A7FF" fillOpacity="0.8" />
                    <circle cx="250" cy="76" r="8" fill="#7CC7FF" fillOpacity="0.8" />
                    <circle cx="360" cy="76" r="8" fill="#7CC7FF" fillOpacity="0.8" />

                    <circle cx="90" cy="220" r="18" fill="rgba(124,199,255,0.12)" />
                    <circle cx="470" cy="220" r="18" fill="rgba(124,199,255,0.12)" />
                    <circle cx="360" cy="76" r="16" fill="rgba(124,199,255,0.10)" />
                  </svg>

                  <div className="absolute left-4 top-6 rounded-[1.1rem] border border-[#2A333C] bg-[#10161D]/95 px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                    <div className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-[#8E98A3]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]" />
                      Site
                    </div>
                    <div className="mt-3 h-2.5 w-14 rounded-full bg-[#2A333C]" />
                  </div>

                  <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-[1.1rem] border border-[#2A333C] bg-[#10161D]/95 px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                    <div className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-[#8E98A3]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#93A7FF]" />
                      IA
                    </div>
                    <div className="mt-3 h-2.5 w-12 rounded-full bg-[#2A333C]" />
                  </div>

                  <div className="absolute right-7 top-[5.25rem] rounded-[1.1rem] border border-[#2A333C] bg-[#10161D]/95 px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                    <div className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-[#8E98A3]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]" />
                      Ops
                    </div>
                    <div className="mt-3 h-2.5 w-14 rounded-full bg-[#2A333C]" />
                  </div>

                  <div className="absolute left-7 bottom-8 rounded-[1.1rem] border border-[#2A333C] bg-[#10161D]/95 px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                    <div className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-[#8E98A3]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]" />
                      Données
                    </div>
                    <div className="mt-3 h-2.5 w-16 rounded-full bg-[#2A333C]" />
                  </div>

                  <div className="absolute bottom-8 right-7 rounded-[1.1rem] border border-[#2A333C] bg-[#10161D]/95 px-3 py-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.2)]">
                    <div className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.14em] text-[#8E98A3]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#93A7FF]" />
                      Outils
                    </div>
                    <div className="mt-3 h-2.5 w-14 rounded-full bg-[#2A333C]" />
                  </div>

                  <div className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-[#2A333C] bg-[#141B22]/95 px-4 py-4 shadow-[0_0_22px_rgba(124,199,255,0.08)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.58rem] uppercase tracking-[0.18em] text-[#8E98A3]">NASSFLOW</span>
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#7CC7FF] shadow-[0_0_18px_rgba(124,199,255,0.8)]" />
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

          <div>
            <SectionLabel>Notre approche</SectionLabel>

            <h2 className="mt-6 max-w-[580px] font-[family-name:var(--font-sora)] text-[clamp(2.1rem,4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#F4F7FA]">
              Nous ne rajoutons pas des outils. Nous concevons un système.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-7 text-[#CDD5DD] sm:text-lg">
              <p>
                NASSFLOW ne cherche pas à ajouter un outil de plus à votre entreprise. Nous concevons une architecture cohérente entre votre site, vos données, vos assistants IA, vos automations et vos outils métier.
              </p>
              <p>
                Une entreprise moderne ne fonctionne pas grâce à des outils isolés. Elle fonctionne grâce à des flux clairs, des décisions plus rapides et des systèmes qui se connectent.
              </p>
            </div>

            <div className="mt-8">
              <ButtonSecondary href="#systems">Découvrir les solutions</ButtonSecondary>
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
