import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problems } from "@/components/Problems";
import { Solution } from "@/components/Solution";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Problems />
        <Solution />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
