import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { seo } from "@/lib/seo";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { AssistantBubble } from '@/components/assistant/AssistantBubble';

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
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
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
    <html
      lang="fr"
      className={`${archivo.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Sans JavaScript, Motion laisse ses blocs à l'état initial,
            donc invisibles. Cette règle les rétablit. */}
        <noscript>
          <style>{`[data-motion-reveal]{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
      </head>

      <body>
        <MotionProvider>
          <ScrollProgress />

          {/* L'en-tête et le pied vivaient dans app/page.tsx : les huit
              autres routes n'avaient donc ni navigation ni mentions
              légales, et la phrase qui décrit l'activité n'était servie
              que sur l'accueil. Ils encadrent désormais toutes les
              pages, et le fond papier est porté ici plutôt que répété
              sur chaque <main>. */}
          <div className="flex min-h-screen flex-col bg-[var(--paper)] text-[var(--ink)]">
            <Navigation />
            {children}
            <Footer />
          </div>

          {/* Hors du flux : la bulle flotte au-dessus de toutes les
              routes. Seul son bouton est chargé au départ. */}
          <AssistantBubble />
        </MotionProvider>
      </body>
    </html>
  );
}
