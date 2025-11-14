import { Button } from "@/components/ui/button";
import { FileCheck, Calculator, Shield, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export const Hero = () => {
  const [, setLocation] = useLocation();
  
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-hero-overlay"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Free South African Tax Calculator</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight cursor-animate-in">
            Calculate Your Tax Refund in 2 Minutes
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Free SARS tax calculator for 2024/2025. Know exactly what you'll get back or owe. No signup required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" variant="default" className="text-lg" onClick={() => setLocation('/calculator')} data-testid="button-calculate-refund">
              <Calculator className="w-5 h-5 mr-2" />
              Calculate My Refund Now
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "100% Free" },
              { icon: Calculator, label: "SARS 2024/2025" },
              { icon: TrendingUp, label: "Instant Results" },
              { icon: FileCheck, label: "Export PDF" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <feature.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
