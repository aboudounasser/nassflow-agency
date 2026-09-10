import Image from 'next/image';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { Reveal } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
import { aiTools, type AiTool } from '@/lib/content/tools';

/* Une pastille du carrousel. */
function ToolChip({ tool }: { tool: AiTool }) {
  return (
    <div className="tool-chip group/chip flex shrink-0 items-center gap-3 rounded-full border border-[#2A333C] bg-[#10161D]/80 py-3 pl-4 pr-5 backdrop-blur-sm sm:gap-3.5 sm:py-3.5 sm:pl-5 sm:pr-6">
      {tool.logo ? (
        <Image
          src={tool.logo}
          alt=""
          width={22}
          height={22}
          className="h-[1.15rem] w-[1.15rem] shrink-0 opacity-80 transition-opacity duration-200 group-hover/chip:opacity-100"
        />
      ) : (
        <span
          aria-hidden="true"
          className="tool-chip__dot inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#7CC7FF]"
        />
      )}

      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-sora)] text-[0.9rem] font-medium tracking-[-0.01em] text-[#F4F7FA] sm:text-[0.98rem]">
          {tool.name}
        </span>

        <span className="mt-1.5 whitespace-nowrap font-[family-name:var(--font-ibm-plex-mono)] text-[0.62rem] uppercase tracking-[0.13em] text-[#9BA5AF] sm:text-[0.66rem] sm:tracking-[0.14em]">
          {tool.role}
        </span>
      </span>
    </div>
  );
}

/* Une rangée : le groupe est rendu deux fois, la seconde copie masquée
   aux lecteurs d'écran. L'animation translate de -50 % fait donc
   repasser la copie exactement sur la position de l'originale — c'est
   ce qui rend la boucle invisible. */
function MarqueeRow({
  tools,
  duration,
  reverse = false,
  className = '',
}: {
  tools: AiTool[];
  duration: string;
  reverse?: boolean;
  className?: string;
}) {
  const group = (hidden: boolean) => (
    <ul
      className="marquee__group"
      aria-hidden={hidden || undefined}
      {...(hidden ? {} : { 'aria-label': 'Outils IA utilisés par NASSFLOW' })}
    >
      {tools.map((tool) => (
        <li key={`${hidden ? 'copy' : 'main'}-${tool.name}`}>
          <ToolChip tool={tool} />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee ${reverse ? 'marquee--reverse' : ''} ${className}`}
      style={{ ['--marquee-duration' as string]: duration }}
    >
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

export function AIToolsMarquee() {
  // La seconde rangée démarre à un autre endroit de la liste : les deux
  // bandes ne présentent jamais la même pastille au même instant.
  const secondRow = [...aiTools.slice(3), ...aiTools.slice(0, 3)];

  return (
    <section
      id="outils"
      aria-label="Outils IA"
      className="relative overflow-hidden border-y border-[#151C23] py-14 sm:py-16 lg:py-20"
    >
      {/* Nappe lumineuse de fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_50%,rgba(124,199,255,0.09),transparent_70%)]"
      />

      <SectionShell className="relative">
        <Reveal className="mx-auto mb-10 max-w-[640px] text-center sm:mb-12">
          <SectionLabel>Notre boîte à outils</SectionLabel>

          <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(1.75rem,6vw,2.6rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-[#F4F7FA] sm:mt-5">
            Les meilleurs modèles, assemblés dans vos systèmes.
          </h2>

          <p className="mx-auto mt-4 max-w-[520px] text-[0.95rem] leading-7 text-[#8E98A3] sm:mt-5">
            Nous ne parions pas sur un seul outil. Nous choisissons le bon pour
            chaque tâche, et nous les faisons travailler ensemble.
          </p>
        </Reveal>
      </SectionShell>

      <Reveal preset="scale" delay={0.08}>
        <TiltCard maxTilt={0} glow glowOpacity={0.65} className="marquee-band">
          <div className="flex flex-col gap-3 sm:gap-4">
            <MarqueeRow tools={aiTools} duration="46s" />
            <MarqueeRow
              tools={secondRow}
              duration="58s"
              reverse
              className="marquee--dim"
            />
          </div>
        </TiltCard>
      </Reveal>
    </section>
  );
}
