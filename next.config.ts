import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /contact et /demarrer-un-projet posaient la même question deux
        // fois. La page disparaît, l'URL non : des liens externes et des
        // favoris pointent encore dessus, et une 404 les perdrait.
        // `permanent` émet un 308, qui préserve la méthode HTTP et dit
        // aux moteurs de reporter le référencement sur la destination.
        source: '/contact',
        destination: '/demarrer-un-projet',
        permanent: true,
      },
      // Les fiches solution ont disparu (refonte 5) : leur contenu vit
      // désormais dans la section Problèmes de l'accueil. Des liens
      // partagés et l'index des moteurs pointent encore dessus.
      {
        source: '/solutions',
        destination: '/#problemes',
        permanent: true,
      },
      {
        source: '/solutions/:slug',
        destination: '/#problemes',
        permanent: true,
      },
      // Leurs images de partage aussi : un aperçu déjà mis en cache par
      // une plateforme retombe sur l'image de l'accueil.
      {
        source: '/og/:slug',
        destination: '/og?v=2',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
