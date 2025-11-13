import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export const CTA = () => {
  const [, setLocation] = useLocation();
  
  return (
    <section className="py-20 bg-secondary">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Calculate Your Tax Refund?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Get an accurate estimate of your 2024/2025 tax liability in minutes with our free calculator
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="default" className="text-lg" onClick={() => setLocation('/calculator')} data-testid="button-calculate-now">
              Start Free Calculator
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/signup')}>
              Sign Up to Save Results
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            {[
              "100% Free to Use",
              "No Registration to Calculate",
              "Uses SARS 2024/2025 Tax Tables",
              "Export to PDF/CSV"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
