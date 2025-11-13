import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, LayoutDashboard, TrendingUp, Building2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import whiteLogo from "@assets/white-logo.png";
import darkLogo from "@assets/dark-logo.png";

export const Header = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
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
              variant="ghost"
              onClick={() => setLocation('/economic')}
              data-testid="button-economic"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Economic Data
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setLocation('/property-tax')}
              data-testid="button-property-tax"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Property Tax
            </Button>
            
            {user ? (
              <Button
                variant="default"
                onClick={() => setLocation('/dashboard')}
                data-testid="button-dashboard"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/login')}
                  data-testid="button-login"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  variant="default"
                  onClick={() => setLocation('/signup')}
                  data-testid="button-signup"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
