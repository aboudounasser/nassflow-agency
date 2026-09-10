import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { ProjectForm } from '@/components/ProjectForm';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Cette page était entièrement cliente : un composant client ne peut pas
 * exporter `metadata`, et la page de conversion héritait donc du titre de
 * l'accueil. Le formulaire est désormais isolé dans `ProjectForm`, la page
 * redevient un composant serveur et porte ses propres balises.
 */
export const metadata: Metadata = {
  title: 'Démarrer un projet | NASSFLOW AGENCY',
  description:
    'Décrivez votre besoin en automatisation, IA ou site web. Nous étudions votre projet et revenons vers vous avec la solution la plus adaptée.',
  alternates: { canonical: '/demarrer-un-projet' },
  openGraph: {
    title: 'Démarrer un projet — NASSFLOW AGENCY',
    description:
      'Présentez votre entreprise et votre besoin. Nous concevons le système intelligent qui va avec.',
    type: 'website',
  },
};

export default function DemarrerUnProjetPage() {
  return (
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <SectionShell className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-1 sm:px-0">
          <Link
            href="/"
            className="group mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-[#8E98A3] transition-colors hover:text-[#7CC7FF] sm:mb-14"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
            >
              ←
            </span>
            Retour à l&apos;accueil
          </Link>

          <Reveal onMount className="mb-10 sm:mb-14 lg:mb-16">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.72rem] sm:tracking-[0.16em]">
              Démarrer un projet
            </p>

            <h1 className="mt-5 max-w-[800px] font-[family-name:var(--font-sora)] text-[clamp(2.2rem,9vw,4rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#F4F7FA] sm:mt-6 sm:text-5xl sm:leading-[1.05] lg:text-[4rem]">
              Construisons votre système intelligent.
            </h1>

            <p className="mt-5 max-w-[620px] text-base leading-7 text-[#8E98A3] sm:mt-6 sm:text-[1.05rem]">
              Présentez-nous votre entreprise, votre besoin et ce que vous
              souhaitez améliorer. Nous étudierons votre projet pour définir
              la solution la plus adaptée.
            </p>
          </Reveal>

          <Reveal preset="soft" delay={0.12}>
            <ProjectForm />
          </Reveal>
        </div>
      </SectionShell>
    </main>
  );
}
