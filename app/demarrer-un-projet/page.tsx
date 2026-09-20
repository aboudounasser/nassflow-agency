import type { Metadata } from 'next';
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
    'Décrivez ce qui vous fait perdre du temps. Nous étudions votre situation et revenons vers vous avec la solution adaptée.',
  alternates: { canonical: '/demarrer-un-projet' },
  openGraph: {
    title: 'Démarrer un projet — NASSFLOW AGENCY',
    description:
      'Décrivez ce qui vous fait perdre du temps. Nous étudions votre situation et revenons vers vous avec la solution adaptée.',
    type: 'website',

    // Redéfinir `openGraph` remplace l'objet hérité du layout au lieu de
    // le compléter : sans cette ligne, la page perd l'image de partage
    // par défaut que le layout tenait de `app/opengraph-image.tsx`, et
    // repart nue sur WhatsApp. `metadataBase` la rend absolue.
    images: ['/opengraph-image'],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Démarrer un projet — NASSFLOW AGENCY',
    description:
      'Décrivez ce qui vous fait perdre du temps. Nous étudions votre situation et revenons vers vous avec la solution adaptée.',
  },
};

export default function DemarrerUnProjetPage() {
  return (
    <main className="flex-1">
      <SectionShell className="pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-[900px] px-1 sm:px-0">
          {/* Pas de lien « Retour à l'accueil » ici : la navigation porte
              déjà « Accueil », et le logo mène au même endroit. */}
          <Reveal onMount preset="soft" className="mb-10 sm:mb-14 lg:mb-16">
            <p className="font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Démarrer un projet
            </p>

            <h1 className="mt-5 font-[family-name:var(--font-archivo)] text-[clamp(2.125rem,6.4vw,4rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-[var(--ink)]">
              Parlons de ce qui vous fait perdre du temps.
            </h1>

            <p className="mt-6 max-w-[58ch] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
              Une question rapide ou un besoin déjà cadré, c’est le même
              formulaire. Répondez à ce qui vous concerne, laissez le reste.
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
