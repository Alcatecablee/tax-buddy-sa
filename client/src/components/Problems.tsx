import { AlertTriangle, Clock, Bug, Shield as ShieldAlert } from "lucide-react";

export const Problems = () => {
  const problems = [
    {
      icon: Clock,
      title: "Time-Consuming Math",
      description: "Manually calculating tax across multiple income sources and deductions takes hours and is prone to mistakes."
    },
    {
      icon: Bug,
      title: "Easy to Make Errors",
      description: "Forgetting to apply age-based rebates or miscalculating tax brackets can cost you money."
    },
    {
      icon: AlertTriangle,
      title: "Complex Tax Rules",
      description: "Understanding SARS regulations, deduction limits, and tax thresholds requires extensive research."
    },
    {
      icon: ShieldAlert,
      title: "Uncertainty About Refunds",
      description: "Without proper calculation, you won't know if you're owed a refund or how much you should pay."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Manual Tax Calculations Are Complex and Error-Prone
          </h2>
          <p className="text-lg text-muted-foreground">
            Understanding South African tax brackets, deductions, and rebates can be challenging
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg bg-card border border-border hover:border-destructive/30 transition-all hover:shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
