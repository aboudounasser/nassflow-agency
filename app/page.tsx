import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Demo } from '@/components/sections/Demo';
import { IntegrationsTable } from '@/components/sections/IntegrationsTable';
import { SystemsByProblem } from '@/components/sections/SystemsByProblem';
import { SolutionsCatalog } from '@/components/sections/SolutionsCatalog';
import { FinalCTA } from '@/components/sections/FinalCTA';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main id="contenu" className="flex-1">
      <Hero />
      <Demo />
      <SystemsByProblem />
      <SolutionsCatalog />
      <IntegrationsTable />
      <FinalCTA />
    </main>
  );
}
