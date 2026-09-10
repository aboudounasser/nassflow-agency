import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
import { Parallax } from '@/components/motion/Parallax';

export function ProblemApproachSection() {
  return (
    <section id="approach" aria-label="Problème et approche">
      <SectionShell className="py-10 sm:py-12 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 xl:gap-12">
          {/* ─────────────────────────────
              CONTENT
          ───────────────────────────── */}
          <Stagger gap={0.08} className="max-w-[520px]">
            <StaggerItem preset="soft">
              <SectionLabel>Le système</SectionLabel>
            </StaggerItem>

            <StaggerItem preset="default">
            <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#F4F7FA] sm:text-[clamp(2.3rem,5vw,3.25rem)]">
              Les outils sont dispersés. L’activité l’est aussi.
            </h2>
            </StaggerItem>

            <StaggerItem preset="soft">
            <div className="mt-5 space-y-3 text-[0.98rem] leading-7 text-[#CDD5DD] sm:mt-6 sm:text-[1.05rem]">
              <p>
                Des outils isolés, des tâches répétées et des données
                fragmentées ralentissent la décision.
              </p>

              <p>
                Le vrai problème n’est pas l’outil. C’est la fragmentation du
                système.
              </p>
            </div>

            </StaggerItem>

            {/* Positionnement */}
            <StaggerItem preset="soft">
            <div className="mt-7 border-l border-[#7CC7FF]/45 pl-4 transition-colors duration-500 sm:mt-8 sm:pl-5">
              <div className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#8E98A3] sm:text-[0.62rem] sm:tracking-[0.18em]">
                Positionnement
              </div>

              <p className="font-[family-name:var(--font-sora)] text-base font-medium leading-7 text-[#F4F7FA] sm:text-lg sm:leading-7">
                Nous ne rajoutons pas des outils. Nous concevons un système.
              </p>
            </div>

            </StaggerItem>

            <StaggerItem preset="soft">
            <div className="mt-7 sm:mt-8">
              <ButtonSecondary
                href="#systems"
                className="min-h-12 w-full justify-center px-6 sm:w-auto"
              >
                Découvrir les solutions
              </ButtonSecondary>
            </div>
            </StaggerItem>
          </Stagger>

          {/* ─────────────────────────────
              SYSTEM VISUAL
          ───────────────────────────── */}
          <Parallax distance={22} className="relative w-full">
            <TiltCard maxTilt={6} glow glowOpacity={0.5} className="rounded-[1.5rem] sm:rounded-[1.75rem]">
            <div
              className="absolute inset-x-6 top-6 h-20 rounded-full bg-[#7CC7FF]/10 blur-3xl sm:inset-x-8 sm:h-24"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#2A333C] bg-[#10161D]/90 p-3 shadow-[0_0_0_1px_rgba(42,51,60,0.2),0_24px_80px_rgba(0,0,0,0.32)] sm:rounded-[1.75rem] sm:p-5">
              {/* Grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20 sm:opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(124,199,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,199,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative">
                {/* Visual header */}
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#2A333C] pb-3 sm:mb-4 sm:pb-3">
                  <span className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-[#8E98A3] sm:text-[0.64rem] sm:tracking-[0.18em]">
                    architecture
                  </span>

                  <span className="text-right text-[0.54rem] font-medium uppercase tracking-[0.14em] text-[#A9D9FF] sm:text-[0.62rem] sm:tracking-[0.18em]">
                    système cohérent
                  </span>
                </div>

                {/* Architecture canvas */}
                <div className="relative h-[18rem] overflow-hidden rounded-[1.1rem] border border-[#2A333C] bg-[#0A0D12] p-2.5 sm:h-[20.5rem] sm:rounded-[1.25rem] sm:p-3">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 620 430"
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient
                        id="problemFlow"
                        x1="0%"
                        x2="100%"
                        y1="0%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="rgba(124,199,255,0)"
                        />
                        <stop
                          offset="30%"
                          stopColor="rgba(124,199,255,0.85)"
                        />
                        <stop
                          offset="60%"
                          stopColor="rgba(147,167,255,0.9)"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgba(124,199,255,0)"
                        />
                      </linearGradient>
                    </defs>

                    {/* Main bridge */}
                    <path
                      className="problem-system-bridge"
                      d="M 90 220 L 190 220 L 250 155 L 360 155 L 470 220"
                      stroke="url(#problemFlow)"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Secondary bridge */}
                    <path
                      className="problem-system-bridge problem-system-bridge--secondary"
                      d="M 190 220 L 190 318 L 360 318 L 470 220"
                      stroke="url(#problemFlow)"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Vertical bridge */}
                    <path
                      className="problem-system-bridge problem-system-bridge--vertical"
                      d="M 250 155 L 250 76 L 360 76 L 360 155"
                      stroke="url(#problemFlow)"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Signals */}
                    <path
                      className="problem-system-signal"
                      d="M 90 220 L 190 220 L 250 155"
                      stroke="rgba(124,199,255,0.7)"
                      strokeWidth="1.4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    <path
                      className="problem-system-signal problem-system-signal--secondary"
                      d="M 250 155 L 360 155 L 470 220"
                      stroke="rgba(124,199,255,0.7)"
                      strokeWidth="1.4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* External connections */}
                    <path
                      d="M 110 150 L 140 150"
                      stroke="rgba(124,199,255,0.35)"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    <path
                      d="M 510 200 L 540 200"
                      stroke="rgba(124,199,255,0.35)"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    <path
                      d="M 260 330 L 280 330"
                      stroke="rgba(124,199,255,0.35)"
                      strokeWidth="2.2"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Nodes */}
                    <circle
                      className="problem-system-node"
                      cx="90"
                      cy="220"
                      r="8"
                      fill="#7CC7FF"
                      fillOpacity="0.9"
                    />

                    <circle
                      className="problem-system-node problem-system-node--alt"
                      cx="190"
                      cy="220"
                      r="8"
                      fill="#93A7FF"
                      fillOpacity="0.9"
                    />

                    <circle
                      className="problem-system-node"
                      cx="250"
                      cy="155"
                      r="8"
                      fill="#7CC7FF"
                      fillOpacity="0.9"
                    />

                    <circle
                      className="problem-system-node problem-system-node--alt"
                      cx="360"
                      cy="155"
                      r="9"
                      fill="#93A7FF"
                      fillOpacity="0.95"
                    />

                    <circle
                      className="problem-system-node"
                      cx="470"
                      cy="220"
                      r="8"
                      fill="#7CC7FF"
                      fillOpacity="0.9"
                    />

                    <circle
                      className="problem-system-node problem-system-node--alt"
                      cx="190"
                      cy="318"
                      r="8"
                      fill="#7CC7FF"
                      fillOpacity="0.8"
                    />

                    <circle
                      className="problem-system-node"
                      cx="360"
                      cy="318"
                      r="8"
                      fill="#93A7FF"
                      fillOpacity="0.8"
                    />

                    <circle
                      className="problem-system-node problem-system-node--slow"
                      cx="250"
                      cy="76"
                      r="8"
                      fill="#7CC7FF"
                      fillOpacity="0.8"
                    />

                    <circle
                      className="problem-system-node"
                      cx="360"
                      cy="76"
                      r="8"
                      fill="#7CC7FF"
                      fillOpacity="0.8"
                    />

                    {/* Node halos */}
                    <circle
                      cx="90"
                      cy="220"
                      r="18"
                      fill="rgba(124,199,255,0.12)"
                    />

                    <circle
                      cx="470"
                      cy="220"
                      r="18"
                      fill="rgba(124,199,255,0.12)"
                    />

                    <circle
                      cx="360"
                      cy="76"
                      r="16"
                      fill="rgba(124,199,255,0.10)"
                    />
                  </svg>

                  {/* Site */}
                  <div className="absolute left-2 top-5 rounded-[0.95rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:left-4 sm:top-6 sm:rounded-[1.1rem] sm:px-3 sm:py-2.5">
                    <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]"
                        aria-hidden="true"
                      />
                      Site
                    </div>

                    <div className="mt-2 h-2 w-11 rounded-full bg-[#2A333C] sm:mt-3 sm:h-2.5 sm:w-14" />
                  </div>

                  {/* IA */}
                  <div className="absolute left-1/2 top-2.5 -translate-x-1/2 rounded-[0.95rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:top-3 sm:rounded-[1.1rem] sm:px-3 sm:py-2.5">
                    <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#93A7FF]"
                        aria-hidden="true"
                      />
                      IA
                    </div>

                    <div className="mt-2 h-2 w-10 rounded-full bg-[#2A333C] sm:mt-3 sm:h-2.5 sm:w-12" />
                  </div>

                  {/* Ops */}
                  <div className="absolute right-2 top-[4.75rem] rounded-[0.95rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:right-7 sm:top-[5.25rem] sm:rounded-[1.1rem] sm:px-3 sm:py-2.5">
                    <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]"
                        aria-hidden="true"
                      />
                      Ops
                    </div>

                    <div className="mt-2 h-2 w-11 rounded-full bg-[#2A333C] sm:mt-3 sm:h-2.5 sm:w-14" />
                  </div>

                  {/* Données */}
                  <div className="parallax-far absolute bottom-5 left-2 rounded-[0.95rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:bottom-8 sm:left-7 sm:rounded-[1.1rem] sm:px-3 sm:py-2.5">
                    <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]"
                        aria-hidden="true"
                      />
                      Données
                    </div>

                    <div className="mt-2 h-2 w-12 rounded-full bg-[#2A333C] sm:mt-3 sm:h-2.5 sm:w-16" />
                  </div>

                  {/* Outils */}
                  <div className="parallax-far absolute bottom-5 right-2 rounded-[0.95rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:bottom-8 sm:right-7 sm:rounded-[1.1rem] sm:px-3 sm:py-2.5">
                    <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.1em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[#93A7FF]"
                        aria-hidden="true"
                      />
                      Outils
                    </div>

                    <div className="mt-2 h-2 w-11 rounded-full bg-[#2A333C] sm:mt-3 sm:h-2.5 sm:w-14" />
                  </div>

                  {/* Core */}
                  <div className="absolute left-1/2 top-[52%] z-10 w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] border border-[#2A333C] bg-[#141B22]/95 px-3 py-3 shadow-[0_0_22px_rgba(124,199,255,0.08)] sm:w-auto sm:min-w-[155px] sm:rounded-[1.5rem] sm:px-4 sm:py-4">
                    <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                      <span className="text-[0.5rem] uppercase tracking-[0.14em] text-[#8E98A3] sm:text-[0.58rem] sm:tracking-[0.18em]">
                        NASSFLOW
                      </span>

                      <span className="problem-system-core-indicator inline-flex h-2 w-2 rounded-full bg-[#7CC7FF] shadow-[0_0_14px_rgba(124,199,255,0.8)] sm:h-2.5 sm:w-2.5 sm:shadow-[0_0_18px_rgba(124,199,255,0.8)]" />
                    </div>

                    <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
                      <div className="h-2 w-12 rounded-full bg-[#7CC7FF]/80 sm:h-2.5 sm:w-16" />
                      <div className="h-1.5 w-14 rounded-full bg-[#2A333C] sm:h-2 sm:w-20" />
                      <div className="h-1.5 w-9 rounded-full bg-[#2A333C] sm:h-2 sm:w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </TiltCard>
          </Parallax>
        </div>
      </SectionShell>
    </section>
  );
}