import { AlertTriangle, Clock, Bug, Shield as ShieldAlert } from "lucide-react";

export const Problems = () => {
  const problems = [
    {
      icon: Clock,
      title: "Hours-Long Wait Times",
      description: "During filing season, traditional eFiling can take hours just to log in and submit."
    },
    {
      icon: Bug,
      title: "Technical Errors & Crashes",
      description: "Frequent system failures and outdated technology make filing frustrating and unreliable."
    },
    {
      icon: AlertTriangle,
      title: "Complex, Confusing Interface",
      description: "Difficult navigation and unclear tax terms leave taxpayers confused and prone to errors."
    },
    {
      icon: ShieldAlert,
      title: "Security Concerns",
      description: "Profile hijacking and security vulnerabilities have affected thousands of taxpayers."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            SARS eFiling Shouldn't Be This Hard
          </h2>
          <p className="text-lg text-muted-foreground">
            Over 7 million South African taxpayers face these challenges every filing season
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg bg-card border border-border hover:border-destructive/30 transition-smooth hover:shadow-soft"
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
