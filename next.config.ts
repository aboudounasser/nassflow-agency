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
    ];
  },
};

export default nextConfig;
