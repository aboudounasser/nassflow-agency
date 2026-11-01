import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Demo } from '@/components/sections/Demo';
import { Problems } from '@/components/sections/Problems';
import { Method } from '@/components/sections/Method';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main id="contenu" className="flex-1">
      <Hero />
      <Demo />
      <Problems />
      <Method />
      <FinalCTA />
    </main>
  );
}
