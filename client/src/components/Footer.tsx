import { useLocation } from "wouter";
import whiteLogo from "@assets/taxify-logo-white.png";
import darkLogo from "@assets/taxify-logo-dark.png";

export const Footer = () => {
  const [, setLocation] = useLocation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={darkLogo} 
                alt="Taxify" 
                className="w-10 h-10 dark:hidden"
              />
              <img 
                src={whiteLogo} 
                alt="Taxify" 
                className="w-10 h-10 hidden dark:block"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">Taxify</span>
                <span className="text-sm text-muted-foreground">taxfy.co.za</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              South Africa's modern tax refund calculator. Calculate your SARS tax refund in minutes with secure, real-time estimates.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setLocation('/calculator')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-calculator"
                >
                  Tax Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setLocation('/dashboard')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-dashboard"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-link-terms"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Taxify. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with care for South African taxpayers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
