import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { seo } from "@/lib/seo";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { AssistantBubble } from '@/components/assistant/AssistantBubble';
import { Analytics } from '@vercel/analytics/next';
import { buttonClasses } from '@/components/ui/Button';
import { motionBootScript } from '@/lib/motion-boot';

// Archivo porte toute la structure : titres, UI, et les micro-labels que
// le monospace assurait avant. D'où les graisses jusqu'à 800.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Instrument Serif porte la voix : citations de dirigeants et seconde
// moitié des grands titres. Une seule graisse, mais l'italique est
// indispensable — c'est elle qui est appelée, pas le romain.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// IBM Plex Mono porte les annotations « machine » : statuts, étapes,
// horodatages. Pas de préchargement : elle ne sert qu'à des détails, et
// le navigateur ne la télécharge que si un élément l'appelle.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.metadataBase),
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.openGraph.title,
    description: seo.openGraph.description,
    type: seo.openGraph.type,
  },

  // Posé ici, donc hérité par toutes les routes : c'est ce qui fait
  // afficher la grande carte plutôt que la vignette carrée. Les pages
  // qui redéfinissent `twitter` le redisent, car redéfinir l'objet
  // remplace l'hérité au lieu de le compléter.
  twitter: {
    card: 'summary_large_image',
    title: seo.openGraph.title,
    description: seo.openGraph.description,
  },

  // Pas de `alternates` ici : posée sur le layout racine, la balise
  // canonique était héritée par toutes les pages, qui se déclaraient
  // alors toutes comme des doublons de l'accueil. Chaque page définit
  // désormais la sienne.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `suppressHydrationWarning` : le script ci-dessous pose
    // `data-motion` sur <html> avant l'hydratation, volontairement.
    <html
      lang="fr"
      className={`${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Amorçage du mouvement, avant le premier rendu : voir
            lib/motion-boot.ts. Sans lui (JS coupé) ou avec « réduire les
            animations », tout s'affiche dans son état final. */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>

      <body>
        {/* Premier arrêt de la tabulation : sauter l'en-tête. Invisible
            tant qu'il n'a pas le focus ; chaque page porte `id="contenu"`
            sur son <main>. */}
        <a
          href="#contenu"
          className={buttonClasses({
            size: 'sm',
            className:
              'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-(--z-assistant) focus:px-5',
          })}
        >
          Aller au contenu
        </a>

        <ScrollProgress />

        {/* L'en-tête et le pied vivaient dans app/page.tsx : les huit
            autres routes n'avaient donc ni navigation ni mentions
            légales, et la phrase qui décrit l'activité n'était servie
            que sur l'accueil. Ils encadrent désormais toutes les
            pages, et le fond papier est porté ici plutôt que répété
            sur chaque <main>. */}
        <div className="flex min-h-screen flex-col bg-paper text-ink">
          <Navigation />
          {children}
          <Footer />
        </div>

        {/* Hors du flux : la bulle flotte au-dessus de toutes les
            routes. Seul son bouton est chargé au départ. */}
        <AssistantBubble />

        {/* Mesure d'audience Vercel : sans cookie et sans identifiant
            qui suive un visiteur d'un site à l'autre. Posée ici, donc
            une seule fois pour toutes les routes. */}
        <Analytics />
      </body>
    </html>
  );
}
