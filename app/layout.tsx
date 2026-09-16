import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { seo } from "@/lib/seo";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { MotionProvider } from "@/components/motion/MotionProvider";

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
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
