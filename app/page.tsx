import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/sections/Hero';
import { ProblemApproachSection } from '@/components/sections/ProblemApproachSection';
import { IntegrationsMarquee } from '@/components/sections/IntegrationsMarquee';
import { SystemsByProblem } from '@/components/sections/SystemsByProblem';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <Navigation />
      <Hero />
      <ProblemApproachSection />
      <IntegrationsMarquee />
      <SystemsByProblem />
      <FinalCTA />
      <Footer />
    </main>
  );
}
