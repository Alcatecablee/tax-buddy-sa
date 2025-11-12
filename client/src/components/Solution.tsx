import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Calculator, Wifi, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import dashboardImage from "@/assets/dashboard-preview.jpg";

export const Solution = () => {
  const [, setLocation] = useLocation();
  const features = [
    {
      icon: Brain,
      title: "Intelligent Pre-filling",
      description: "Our AI assistant automatically fills forms using your previous returns and tax data."
    },
    {
      icon: Sparkles,
      title: "Plain Language Explanations",
      description: "Complex tax terms are explained in simple, easy-to-understand language."
    },
    {
      icon: Calculator,
      title: "Real-time Refund Estimates",
      description: "See exactly how much you'll get back as you fill out your return."
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      description: "Work on your return offline and sync automatically when you're back online."
    },
    {
      icon: Building2,
      title: "Bank Statement Integration",
      description: "Connect your bank via open banking for automatic income and deduction tracking."
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-light border border-success/20 mb-4">
            <Sparkles className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">The Modern Solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            File Taxes The Smart Way
          </h2>
          <p className="text-lg text-muted-foreground">
            Our intelligent assistant transforms the tax filing experience with modern technology
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <img 
                src={dashboardImage} 
                alt="Modern tax filing dashboard showing simplified forms and real-time calculations"
                className="rounded-2xl shadow-large border border-border"
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
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-smooth hover:shadow-soft"
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
            <Button size="lg" variant="accent" onClick={() => setLocation('/calculator')} data-testid="button-try-calculator">
              Try the Calculator Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
