import Image from 'next/image';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { Reveal } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
import { builtWith, connectedTools, type Tool } from '@/lib/content/tools';

function ToolChip({ tool }: { tool: Tool }) {
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
        <span className="whitespace-nowrap font-[family-name:var(--font-sora)] text-[0.9rem] font-medium tracking-[-0.01em] text-[#F4F7FA] sm:text-[0.98rem]">
          {tool.name}
        </span>

        <span className="mt-1.5 whitespace-nowrap font-[family-name:var(--font-ibm-plex-mono)] text-[0.62rem] uppercase tracking-[0.13em] text-[#9BA5AF] sm:text-[0.66rem] sm:tracking-[0.14em]">
          {tool.role}
        </span>
      </span>
    </div>
  );
}

/* Le groupe est rendu deux fois, la seconde copie masquée aux lecteurs
   d'écran. La translation de -50 % ramène donc la copie exactement sur
   la position de l'originale : la boucle n'a pas de couture. */
function MarqueeRow({
  tools,
  duration,
  label,
  reverse = false,
  dim = false,
}: {
  tools: Tool[];
  duration: string;
  label: string;
  reverse?: boolean;
  dim?: boolean;
}) {
  // Un groupe plus étroit que l'écran laisserait un trou en fin de boucle :
  // la piste ne fait que deux groupes de large et se translate d'un groupe.
  // On répète donc la liste jusqu'à dépasser largement la largeur visible.
  const items: Tool[] = [];
  while (items.length < 14) items.push(...tools);

  const group = (hidden: boolean) => (
    <ul
      className="marquee__group"
      aria-hidden={hidden || undefined}
      {...(hidden ? {} : { 'aria-label': label })}
    >
      {items.map((tool, index) => (
        <li key={`${hidden ? 'copy' : 'main'}-${index}-${tool.name}`}>
          <ToolChip tool={tool} />
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <SectionShell className="mb-3.5">
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.62rem] uppercase tracking-[0.18em] text-[#8E98A3] sm:text-[0.66rem]">
          {label}
        </p>
      </SectionShell>

      <div
        className={`marquee ${reverse ? 'marquee--reverse' : ''} ${
          dim ? 'marquee--dim' : ''
        }`}
        style={{ ['--marquee-duration' as string]: duration }}
      >
        <div className="marquee__track">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}

export function IntegrationsMarquee() {
  return (
    <section
      id="outils"
      aria-label="Intégrations"
      className="relative overflow-hidden border-y border-[#151C23] py-14 sm:py-16 lg:py-20"
    >
      {/* Nappe lumineuse de fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-48 -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_50%,rgba(124,199,255,0.09),transparent_70%)]"
      />

      <SectionShell className="relative">
        <Reveal className="mx-auto mb-10 max-w-[680px] text-center sm:mb-12">
          <SectionLabel>Intégrations</SectionLabel>

          <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(1.8rem,6vw,2.75rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-[#F4F7FA] sm:mt-5">
            On ne remplace rien. On relie.
          </h2>

          <p className="mx-auto mt-5 max-w-[540px] text-[0.98rem] leading-7 text-[#CDD5DD]">
            Vos logiciels actuels restent en place. On les fait communiquer
            entre eux, et on ajoute seulement ce qui manque. Les modèles d&apos;IA
            sont choisis tâche par tâche — jamais imposés, jamais un
            fournisseur unique.
          </p>
        </Reveal>
      </SectionShell>

      <Reveal preset="scale" delay={0.08}>
        <TiltCard maxTilt={0} glow glowOpacity={0.65} className="marquee-band">
          <div className="flex flex-col gap-8 sm:gap-9">
            <MarqueeRow
              tools={connectedTools}
              duration="52s"
              label="Ce qu'on relie chez vous"
            />

            <MarqueeRow
              tools={builtWith}
              duration="44s"
              label="Ce avec quoi on le construit"
              reverse
              dim
            />
          </div>
        </TiltCard>
      </Reveal>

      <SectionShell className="relative">
        <Reveal preset="soft" className="mx-auto mt-10 max-w-[560px] text-center sm:mt-12">
          <p className="text-[0.95rem] leading-7 text-[#8E98A3]">
            Votre logiciel métier n&apos;est pas dans la liste ? S&apos;il
            expose une API, il se branche — et la plupart en exposent une.
            Dites-nous lequel, on vous répond franchement.
          </p>
        </Reveal>
      </SectionShell>
    </section>
  );
}
