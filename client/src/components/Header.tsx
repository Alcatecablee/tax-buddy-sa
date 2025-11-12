import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import whiteLogo from "@assets/white_1762968074506.png";
import darkLogo from "@assets/dark_1762968088751.png";

export const Header = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2"
            data-testid="link-home"
          >
            <img 
              src={darkLogo} 
              alt="Taxify" 
              className="w-8 h-8 dark:hidden"
            />
            <img 
              src={whiteLogo} 
              alt="Taxify" 
              className="w-8 h-8 hidden dark:block"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Taxify</span>
              <span className="text-xs text-muted-foreground">taxfy.co.za</span>
            </div>
          </button>
          
          <div className="flex items-center gap-3 flex-wrap">
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
