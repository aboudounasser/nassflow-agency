import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { ProblemApproachSection } from "@/components/sections/ProblemApproachSection";
import { SolutionsSystem } from "@/components/sections/SolutionsSystem";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <Navigation />
      <Hero />
      <ProblemApproachSection />
      <SolutionsSystem />
      <FinalCTA />
      <Footer />
    </main>
  );
}