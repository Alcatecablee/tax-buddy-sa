import { Button } from "@/components/ui/button";
import { Calculator, Brain, Sparkles, Wifi, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import dashboardImage from "@/assets/dashboard-preview.jpg";

export const Solution = () => {
  const [, setLocation] = useLocation();
  const features = [
    {
      icon: Calculator,
      title: "SARS 2024/2025 Tax Tables",
      description: "Accurate calculations using the 2024/2025 tax brackets, thresholds, and rebates published by SARS."
    },
    {
      icon: Sparkles,
      title: "Multiple Income Sources",
      description: "Calculate tax on salary, freelance, rental, and investment income all in one place."
    },
    {
      icon: Brain,
      title: "Instant Refund Calculation",
      description: "See your estimated refund or tax owing immediately based on your PAYE and provisional payments."
    },
    {
      icon: Wifi,
      title: "Works Offline",
      description: "Calculator works without internet connection. Sign in to save and sync your calculations across devices."
    },
    {
      icon: Building2,
      title: "Export Your Results",
      description: "Download your tax calculations as PDF or CSV files for your records and tax planning."
    }
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Simple & Accurate</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Calculate Your Tax Refund With Confidence
          </h2>
          <p className="text-lg text-muted-foreground">
            Our free calculator uses official SARS tax tables for the 2024/2025 tax year
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src={dashboardImage} 
                alt="Modern tax filing dashboard showing simplified forms and real-time calculations"
                className="rounded-2xl shadow-lg border border-border"
              />
            </div>
            
            <div className="order-1 lg:order-2 space-y-6">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.slice(3).map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-all hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="default" onClick={() => setLocation('/calculator')} data-testid="button-try-calculator">
              Try the Calculator Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
