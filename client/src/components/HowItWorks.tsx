import { ArrowRight, UserPlus, FileText, CheckCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Enter Your Information",
      description: "Start with your age category, then add all income sources (salary, freelance, rental, investments)."
    },
    {
      icon: FileText,
      number: "02",
      title: "Add Deductions & Tax Paid",
      description: "Include retirement contributions, medical aid, donations, and the tax you've already paid (PAYE, provisional)."
    },
    {
      icon: CheckCircle,
      number: "03",
      title: "Get Your Results",
      description: "See your tax liability and estimated refund instantly. Save to your account or export to PDF/CSV."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Three Simple Steps to Calculate Your Tax
          </h2>
          <p className="text-lg text-muted-foreground">
            Get your refund estimate in minutes with our free calculator
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mb-4 shadow-medium">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <div className="text-4xl font-bold text-primary/20 mb-2">
                    {step.number}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent">
                    <ArrowRight className="absolute -right-1 -top-2 w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
