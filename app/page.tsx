import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { IntegrationsTable } from '@/components/sections/IntegrationsTable';
import { SystemsByProblem } from '@/components/sections/SystemsByProblem';
import { SolutionsCatalog } from '@/components/sections/SolutionsCatalog';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main id="home" className="flex-1">
      <Hero />
      <SystemsByProblem />
      <SolutionsCatalog />
      <IntegrationsTable />
      <FinalCTA />
    </main>
  );
}
