import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useLocation } from "wouter";
import whiteLogo from "@assets/white-logo.png";
import darkLogo from "@assets/dark-logo.png";

export const Header = () => {
  const [, setLocation] = useLocation();
  
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button 
            onClick={() => setLocation('/')}
            className="hover-elevate active-elevate-2 rounded-md p-2 -ml-2"
            data-testid="link-home"
          >
            <img 
              src={darkLogo} 
              alt="Taxify" 
              className="h-10 dark:hidden"
            />
            <img 
              src={whiteLogo} 
              alt="Taxify" 
              className="h-10 hidden dark:block"
            />
          </button>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="default"
              onClick={() => setLocation('/calculator')}
              data-testid="button-calculator"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Refund
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
