import Link from 'next/link';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { solutions, type Solution } from '@/lib/content/solutions';

/**
 * Le catalogue, juste après les quatre symptômes : la section #systems
 * fait dire « c'est moi », celle-ci répond « voilà par où on commence ».
 *
 * Les textes viennent tels quels de lib/content/solutions.ts — aucune
 * reformulation ici, la règle d'écriture vit dans le fichier de contenu.
 */

/** Les deux familles, dans l'ordre où elles s'affichent. */
const groups = [
  {
    category: 'agent' as const,
    title: 'Agents',
    description:
      'Ils parlent à vos clients et traitent ce qui arrive, avec vos mots et vos conditions.',
  },
  {
    category: 'automatisation' as const,
    title: 'Automatisations',
    description:
      'Elles font le travail répétitif à votre place, entre les outils que vous avez déjà.',
  },
];

function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group flex h-full flex-col rounded-[1.25rem] border border-[#2A333C] bg-[#10161D]/70 p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#7CC7FF]/40 hover:bg-[#111A23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7CC7FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D12] sm:rounded-[1.5rem] sm:p-7"
    >
      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.66rem] uppercase tracking-[0.16em] text-[#8E98A3] transition-colors duration-300 group-hover:text-[#7CC7FF]">
        {solution.categoryLabel}
      </span>

      <h3 className="mt-4 font-[family-name:var(--font-sora)] text-[1.3rem] font-medium leading-[1.22] tracking-[-0.035em] text-[#F4F7FA] sm:text-[1.4rem]">
        {solution.title}
      </h3>

      {/* La phrase du dirigeant, citée comme dans la section #systems. */}
      <p className="mt-3 text-[0.92rem] leading-6 text-[#8E98A3]">
        <span className="text-[#8E98A3]/70">«&nbsp;</span>
        {solution.problem}
        <span className="text-[#8E98A3]/70">&nbsp;»</span>
      </p>

      <p className="mt-4 text-[0.95rem] leading-7 text-[#E3E9EF]">
        {solution.delivers}
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-[#2A333C] pt-5 transition-colors duration-300 group-hover:border-[#7CC7FF]/20">
        {solution.includes.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-[0.88rem] leading-6 text-[#8E98A3]"
          >
            <span
              aria-hidden="true"
              className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[#7CC7FF]/60 transition-colors duration-300 group-hover:bg-[#7CC7FF]"
            />
            {item}
          </li>
        ))}
      </ul>

      {/* `mt-auto` cale ce pied en bas quelle que soit la hauteur du texte,
          pour que les flèches s'alignent d'une carte à l'autre. */}
      <span className="mt-auto flex items-center gap-2 pt-6 text-[0.85rem] font-medium text-[#A9D9FF]">
        Voir cette solution
        <span
          aria-hidden="true"
          className="inline-block text-[#7CC7FF] transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}

export function SolutionsCatalog() {
  return (
    <section
      id="solutions"
      aria-label="Catalogue de solutions"
      className="border-t border-[#151C23]"
    >
      <SectionShell className="py-14 sm:py-16 lg:py-20">
        <Reveal className="section-aura mx-auto max-w-[720px] text-center">
          <SectionLabel>Par où on commence</SectionLabel>

          <h2 className="mt-4 font-[family-name:var(--font-sora)] text-[clamp(1.9rem,6.5vw,3.1rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#F4F7FA] sm:mt-5">
            Six points de départ, pas six produits.
          </h2>

          <p className="mx-auto mt-5 max-w-[560px] text-[0.98rem] leading-7 text-[#CDD5DD]">
            Chacune s&apos;adapte à votre façon de travailler : vos tarifs, vos
            catégories, vos créneaux. Prenez celle qui vous parle, on part de
            là.
          </p>
        </Reveal>

        <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14 lg:mt-16">
          {groups.map((group) => (
            <div key={group.category}>
              <Reveal preset="soft" className="max-w-[560px]">
                <h3 className="font-[family-name:var(--font-sora)] text-[1.05rem] font-medium uppercase tracking-[0.14em] text-[#F4F7FA]">
                  {group.title}
                </h3>

                <p className="mt-2.5 text-[0.93rem] leading-6 text-[#8E98A3]">
                  {group.description}
                </p>
              </Reveal>

              <Stagger
                gap={0.08}
                className="mt-7 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-3"
              >
                {solutions
                  .filter((solution) => solution.category === group.category)
                  .map((solution) => (
                    <StaggerItem key={solution.slug} className="h-full">
                      <SolutionCard solution={solution} />
                    </StaggerItem>
                  ))}
              </Stagger>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
