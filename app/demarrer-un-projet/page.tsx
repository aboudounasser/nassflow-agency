import type { Metadata } from 'next';
import { SectionShell } from '@/components/SectionShell';
import { DiagnosticForm } from '@/components/DiagnosticForm';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { diagnosticContent } from '@/lib/content/diagnostic';
import { defaultOgAlt, ogImages } from '@/lib/og';

/**
 * Le formulaire de diagnostic. L'URL reste /demarrer-un-projet : tous les
 * boutons « Demander un diagnostic » du site, et les liens déjà partagés,
 * y mènent.
 *
 * La page est un composant serveur (elle porte ses balises) ; seul le
 * formulaire est client (components/DiagnosticForm.tsx). Textes :
 * lib/content/diagnostic.ts.
 */

const { page } = diagnosticContent;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: '/demarrer-un-projet' },
  openGraph: {
    title: page.shareTitle,
    description: page.description,
    type: 'website',

    // Redéfinir `openGraph` remplace l'objet hérité du layout au lieu de
    // le compléter : sans cette ligne, la page perd l'image de partage
    // par défaut (app/og/route.tsx), et repart nue sur WhatsApp.
    // `metadataBase` la rend absolue, `ogImages` la versionne.
    images: ogImages('/og', defaultOgAlt),
  },

  twitter: {
    card: 'summary_large_image',
    title: page.shareTitle,
    description: page.description,
    // Même piège que pour `openGraph` : redéfini, `twitter` perd l'image.
    images: ogImages('/og', defaultOgAlt),
  },
};

export default function DemarrerUnProjetPage() {
  return (
    <main id="contenu" className="flex-1">
      <SectionShell className="pt-14 pb-section sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-[900px] px-1 sm:px-0">
          <div className="mb-10 sm:mb-12">
            <Eyebrow as="p">{page.eyebrow}</Eyebrow>

            <h1 className="mt-5 font-heading text-title text-ink">{page.h1}</h1>

            <p className="mt-6 max-w-measure text-body text-ink-body">{page.intro}</p>
          </div>

          <DiagnosticForm />
        </div>
      </SectionShell>
    </main>
  );
}
