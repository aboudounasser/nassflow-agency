import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";
import { seo } from "@/lib/seo";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { MotionProvider } from "@/components/motion/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${inter.variable} ${sora.variable} ${ibmPlexMono.variable}`}
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
