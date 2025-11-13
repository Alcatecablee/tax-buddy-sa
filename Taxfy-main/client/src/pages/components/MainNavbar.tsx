import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const MainNavbar = () => (
  <nav
    className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-colors duration-300"
    role="navigation"
    aria-label="Main navigation"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/logo-ta.png" 
              alt="Taxfy Logo" 
              className="w-6 h-6 object-contain object-center transition-transform hover:scale-110" 
            />
            <span className="text-xl font-bold text-foreground">Taxfy</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            to="/how-to"
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline focus:outline-2 focus:outline-primary rounded flex items-center space-x-1"
            tabIndex={0}
            aria-label="How to use Taxfy"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How To</span>
          </Link>
          
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline focus:outline-2 focus:outline-primary rounded"
            tabIndex={0}
            aria-label="Go to Dashboard"
          >
            Dashboard
          </Link>
          
          <Button asChild className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" tabIndex={0}>
            <Link to="/upload">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  </nav>
);
export default MainNavbar;
