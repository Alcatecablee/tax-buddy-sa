import { Button } from "@/components/ui/button";
import { FileCheck, Clock, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-banner.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light/20 border border-primary-light mb-6 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm text-primary-foreground font-medium">Trusted by South African taxpayers</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            File Your Taxes in Minutes, Not Hours
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Say goodbye to long wait times and confusing forms. Our modern tax filing assistant makes SARS eFiling simple, fast, and stress-free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" variant="accent" className="text-lg" onClick={() => navigate('/calculator')}>
              Calculate My Refund
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
              See How It Works
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "5x Faster Filing" },
              { icon: FileCheck, label: "Pre-filled Forms" },
              { icon: TrendingUp, label: "Real-time Estimates" },
              { icon: Shield, label: "Bank-level Security" }
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
