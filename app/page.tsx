import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/sections/Hero';
import { IntegrationsTable } from '@/components/sections/IntegrationsTable';
import { SystemsByProblem } from '@/components/sections/SystemsByProblem';
import { SolutionsCatalog } from '@/components/sections/SolutionsCatalog';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Navigation />
      <Hero />
      <SystemsByProblem />
      <SolutionsCatalog />
      <IntegrationsTable />
      <FinalCTA />
      <Footer />
    </main>
  );
}
