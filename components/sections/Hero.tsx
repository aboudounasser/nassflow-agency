import { ButtonPrimary } from '@/components/ui/ButtonPrimary';
import { ButtonSecondary } from '@/components/ui/ButtonSecondary';
import { SectionShell } from '@/components/SectionShell';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
import { Magnetic } from '@/components/motion/Magnetic';
import { Parallax } from '@/components/motion/Parallax';

export function Hero() {
  return (
    <SectionShell className="pt-7 pb-8 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 xl:gap-12">
        {/* ─────────────────────────────
            HERO CONTENT
        ───────────────────────────── */}
        <Stagger onMount gap={0.085} className="max-w-[700px]">
          <StaggerItem preset="soft">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2A333C] bg-[#10161D] px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#CDD5DD] transition-colors duration-300 hover:border-[#7CC7FF]/40 sm:text-[0.68rem] sm:tracking-[0.2em]">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF] sm:h-2 sm:w-2"
              aria-hidden="true"
            />
            AI • AUTOMATION • WEB
          </span>
          </StaggerItem>

          <StaggerItem preset="default">
          <h1 className="mt-5 max-w-[700px] font-[family-name:var(--font-sora)] text-[clamp(2.45rem,9vw,5.1rem)] font-medium leading-[0.94] tracking-[-0.06em] text-[#F4F7FA] sm:mt-6 sm:text-[clamp(3rem,7vw,5.1rem)] lg:leading-[0.91]">
            Votre entreprise mérite plus qu’un simple site.
            <span className="mt-2 block text-[#CDD5DD]">
              Elle mérite un système intelligent.
            </span>
          </h1>
          </StaggerItem>

          <StaggerItem preset="soft">
          <p className="mt-5 max-w-[620px] text-[0.98rem] leading-7 text-[#CDD5DD] sm:mt-6 sm:text-lg sm:leading-[1.75rem]">
            Nous concevons des sites web, assistants IA et automatisations qui
            relient vos outils et font avancer votre entreprise.
          </p>
          </StaggerItem>

          {/* CTA */}
          <StaggerItem preset="soft">
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Magnetic className="flex w-full sm:w-auto" strength={5}>
            <ButtonPrimary
              href="/demarrer-un-projet"
              className="min-h-12 w-full justify-center px-6 shadow-[0_0_0_1px_rgba(124,199,255,0.10)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,199,255,0.12)] sm:w-auto"
            >
              Démarrer un projet
            </ButtonPrimary>
            </Magnetic>

            <ButtonSecondary
              href="#systems"
              className="min-h-12 w-full justify-center border-[#2F3945] bg-[#0F141A]/60 px-6 text-[#EAF1F7] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#4A5867] hover:bg-[#111A23] sm:w-auto"
            >
              Découvrir nos systèmes
            </ButtonSecondary>
          </div>
          </StaggerItem>

          {/* Capabilities */}
          <StaggerItem preset="soft">
          <div className="mt-7 flex max-w-[560px] flex-wrap items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#8E98A3] sm:mt-8 sm:text-[0.62rem] sm:tracking-[0.18em]">
            <span className="rounded-full border border-[#2A333C] bg-[#10161D] px-2.5 py-1.5">
              Plus de demandes
            </span>

            <span className="rounded-full border border-[#2A333C] bg-[#10161D] px-2.5 py-1.5">
              Réponses immédiates
            </span>

            <span className="rounded-full border border-[#2A333C] bg-[#10161D] px-2.5 py-1.5">
              Zéro double saisie
            </span>

            <span className="rounded-full border border-[#2A333C] bg-[#10161D] px-2.5 py-1.5">
              Un seul tableau de bord
            </span>
          </div>
          </StaggerItem>
        </Stagger>

        {/* ─────────────────────────────
            SYSTEM VISUAL
        ───────────────────────────── */}
        <Parallax
          distance={-26}
          className="relative mx-auto w-full max-w-[620px] lg:max-w-none"
        >
          <TiltCard maxTilt={7} glow glowOpacity={0.55} className="rounded-[1.5rem] sm:rounded-[2rem]">
          <div
            className="hero-system-glow absolute inset-x-8 top-8 h-28 rounded-full bg-[#7CC7FF]/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="hero-system-panel relative overflow-hidden rounded-[1.5rem] border border-[#2A333C] bg-[#10161D]/85 p-2.5 shadow-[0_0_0_1px_rgba(42,51,60,0.28),0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:rounded-[2rem] sm:p-4 lg:p-5">
            {/* Grid background */}
            <div
              aria-hidden="true"
              className="hero-system-grid pointer-events-none absolute inset-0 opacity-20 sm:opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(124,199,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,199,255,0.08) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />

            {/* Panel header */}
            <div className="relative flex items-center justify-between border-b border-[#2A333C] pb-3 sm:pb-4">
              <div className="flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#CDD5DD] sm:text-[0.68rem] sm:tracking-[0.18em]">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF] shadow-[0_0_12px_rgba(124,199,255,0.9)] sm:h-2 sm:w-2 sm:shadow-[0_0_16px_rgba(124,199,255,0.9)]"
                  aria-hidden="true"
                />
                NASSFLOW
              </div>

              <span className="rounded-full border border-[#2A333C] bg-[#141B22] px-2 py-1 text-[0.52rem] uppercase tracking-[0.14em] text-[#8E98A3] sm:px-2.5 sm:py-1 sm:text-[0.62rem] sm:tracking-[0.16em]">
                live system
              </span>
            </div>

            {/* Architecture */}
            <div className="relative mt-3 h-[19rem] sm:mt-5 sm:h-[23rem] lg:h-[25rem]">
              <svg
                aria-hidden="true"
                viewBox="0 0 620 460"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="flowLine"
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
                      stopColor="rgba(124,199,255,0.8)"
                    />
                    <stop
                      offset="50%"
                      stopColor="rgba(147,167,255,0.95)"
                    />
                    <stop
                      offset="100%"
                      stopColor="rgba(124,199,255,0)"
                    />
                  </linearGradient>

                  <linearGradient
                    id="flowLineVertical"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgba(124,199,255,0)"
                    />
                    <stop
                      offset="50%"
                      stopColor="rgba(124,199,255,0.8)"
                    />
                    <stop
                      offset="100%"
                      stopColor="rgba(124,199,255,0)"
                    />
                  </linearGradient>
                </defs>

                {/* Main flow */}
                <path
                  className="hero-system-flow"
                  d="M 90 240 L 220 240 L 290 180 L 390 180 L 500 240"
                  stroke="url(#flowLine)"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Secondary flow */}
                <path
                  className="hero-system-flow hero-system-flow--secondary"
                  d="M 220 240 L 220 340 L 390 340 L 500 240"
                  stroke="url(#flowLine)"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Vertical flow */}
                <path
                  className="hero-system-flow hero-system-flow--vertical"
                  d="M 290 180 L 290 90 L 390 90 L 390 180"
                  stroke="url(#flowLineVertical)"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Signals */}
                <path
                  className="hero-system-signal hero-system-signal--primary"
                  d="M 90 240 L 220 240 L 290 180"
                  stroke="rgba(124,199,255,0.7)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                <path
                  className="hero-system-signal hero-system-signal--secondary"
                  d="M 290 180 L 390 180 L 500 240"
                  stroke="rgba(124,199,255,0.7)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Nodes */}
                <circle
                  className="hero-system-node hero-system-node--slow"
                  cx="90"
                  cy="240"
                  r="7"
                  fill="#7CC7FF"
                  fillOpacity="0.9"
                />

                <circle
                  className="hero-system-node hero-system-node--alt"
                  cx="220"
                  cy="240"
                  r="7"
                  fill="#93A7FF"
                  fillOpacity="0.9"
                />

                <circle
                  className="hero-system-node"
                  cx="290"
                  cy="180"
                  r="7"
                  fill="#7CC7FF"
                  fillOpacity="0.95"
                />

                <circle
                  className="hero-system-node hero-system-node--alt"
                  cx="390"
                  cy="180"
                  r="8"
                  fill="#93A7FF"
                  fillOpacity="0.95"
                />

                <circle
                  className="hero-system-node hero-system-node--slow"
                  cx="500"
                  cy="240"
                  r="8"
                  fill="#7CC7FF"
                  fillOpacity="0.95"
                />

                <circle
                  className="hero-system-node hero-system-node--alt"
                  cx="220"
                  cy="340"
                  r="7"
                  fill="#7CC7FF"
                  fillOpacity="0.9"
                />

                <circle
                  className="hero-system-node"
                  cx="390"
                  cy="340"
                  r="7"
                  fill="#93A7FF"
                  fillOpacity="0.9"
                />

                <circle
                  className="hero-system-node hero-system-node--slow"
                  cx="290"
                  cy="90"
                  r="7"
                  fill="#7CC7FF"
                  fillOpacity="0.9"
                />

                <circle
                  className="hero-system-node"
                  cx="390"
                  cy="90"
                  r="7"
                  fill="#7CC7FF"
                  fillOpacity="0.9"
                />

                {/* Node halos */}
                <circle
                  cx="90"
                  cy="240"
                  r="16"
                  fill="rgba(124,199,255,0.12)"
                />

                <circle
                  cx="500"
                  cy="240"
                  r="16"
                  fill="rgba(124,199,255,0.12)"
                />

                <circle
                  cx="290"
                  cy="90"
                  r="14"
                  fill="rgba(124,199,255,0.10)"
                />
              </svg>

              {/* Site */}
              <div className="parallax-near hero-system-card absolute left-1 top-5 rounded-[1rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:left-2 sm:top-8 sm:rounded-[1.125rem] sm:px-3">
                <div className="flex items-center gap-1.5 text-[0.5rem] font-medium uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]"
                    aria-hidden="true"
                  />
                  Site
                </div>

                <div className="mt-2.5 h-2 w-12 rounded-full bg-[#2A333C] sm:mt-3 sm:h-2.5 sm:w-16" />
                <div className="mt-1.5 h-1.5 w-9 rounded-full bg-[#2A333C] sm:mt-2 sm:h-2 sm:w-12" />
              </div>

              {/* IA */}
              <div className="parallax-near hero-system-card absolute right-1 top-6 rounded-[1rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:right-2 sm:top-10 sm:rounded-[1.125rem] sm:px-3">
                <div className="flex items-center gap-1.5 text-[0.5rem] font-medium uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#93A7FF]"
                    aria-hidden="true"
                  />
                  IA
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 sm:mt-3 sm:gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-[#7CC7FF] sm:h-2.5 sm:w-2.5"
                    aria-hidden="true"
                  />
                  <span className="h-1.5 w-8 rounded-full bg-[#2A333C] sm:h-2 sm:w-10" />
                </div>
              </div>

              {/* Core */}
              <div className="hero-system-core absolute left-1/2 top-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] border border-[#2A333C] bg-[#141B22]/95 p-3 shadow-[0_0_20px_rgba(124,199,255,0.08)] sm:w-[33%] sm:rounded-[1.5rem] sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.5rem] uppercase tracking-[0.14em] text-[#8E98A3] sm:text-[0.58rem] sm:tracking-[0.16em]">
                    Core
                  </span>

                  <span className="hero-system-core-indicator inline-flex h-2 w-2 rounded-full bg-[#7CC7FF] shadow-[0_0_14px_rgba(124,199,255,0.8)] sm:h-2.5 sm:w-2.5 sm:shadow-[0_0_18px_rgba(124,199,255,0.8)]" />
                </div>

                <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
                  <div className="h-2 w-12 rounded-full bg-[#7CC7FF]/80 sm:h-2.5 sm:w-16" />
                  <div className="h-1.5 w-16 rounded-full bg-[#2A333C] sm:h-2 sm:w-20" />
                  <div className="h-1.5 w-9 rounded-full bg-[#2A333C] sm:h-2 sm:w-12" />
                </div>
              </div>

              {/* Ops */}
              <div className="parallax-far hero-system-card absolute bottom-4 left-3 rounded-[1rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:bottom-7 sm:left-10 sm:rounded-[1.125rem] sm:px-3">
                <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#7CC7FF]"
                    aria-hidden="true"
                  />
                  Ops
                </div>

                <div className="mt-1.5 h-1.5 w-9 rounded-full bg-[#2A333C] sm:mt-2 sm:h-2 sm:w-12" />
              </div>

              {/* Automation */}
              <div className="parallax-far hero-system-card absolute bottom-4 right-3 rounded-[1rem] border border-[#2A333C] bg-[#10161D]/95 px-2.5 py-2 shadow-[0_0_0_1px_rgba(42,51,60,0.2)] sm:bottom-7 sm:right-7 sm:rounded-[1.125rem] sm:px-3">
                <div className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.1em] text-[#8E98A3] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.14em]">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[#93A7FF]"
                    aria-hidden="true"
                  />
                  Automation
                </div>

                <div className="mt-1.5 h-1.5 w-12 rounded-full bg-[#2A333C] sm:mt-2 sm:h-2 sm:w-16" />
              </div>
            </div>
          </div>
          </TiltCard>
        </Parallax>
      </div>
    </SectionShell>
  );
}