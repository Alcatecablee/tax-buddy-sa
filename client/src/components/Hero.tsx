import { Button } from "@/components/ui/button";
import { FileCheck, Calculator, Shield, TrendingUp, LogIn, UserPlus } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-banner.jpg";

export const Hero = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img 
          src={heroImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(185,57%,30%)] via-[hsl(185,57%,35%)] to-[hsl(185,57%,40%)] opacity-90"></div>
      
      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light/20 border border-primary-light mb-6 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm text-primary-foreground font-medium">Free South African Tax Calculator</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Calculate Your South African Tax Refund Accurately
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Free tax calculator for the 2024/2025 tax year. Enter your income and deductions to calculate your SARS tax liability and estimated refund in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" variant="accent" className="text-lg" onClick={() => setLocation('/calculator')} data-testid="button-calculate-refund">
              Calculate My Refund
            </Button>
            {user ? (
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setLocation('/dashboard')}
                data-testid="button-dashboard"
              >
                View Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setLocation('/login')}
                  data-testid="button-login"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setLocation('/signup')}
                  data-testid="button-signup"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calculator, label: "SARS 2024/2025 Brackets" },
              { icon: FileCheck, label: "Export to PDF/CSV" },
              { icon: TrendingUp, label: "Instant Calculation" },
              { icon: Shield, label: "100% Free" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-primary-foreground/80">
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
