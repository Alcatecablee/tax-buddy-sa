import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Tax Filing Experience?
          </h2>
          
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of South Africans who've already made the switch to stress-free tax filing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="accent" className="text-lg">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
              Schedule a Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/80">
            {[
              "No credit card required",
              "Free for basic returns",
              "Bank-level security",
              "24/7 support"
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
