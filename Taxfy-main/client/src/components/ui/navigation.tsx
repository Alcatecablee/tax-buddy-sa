import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./button";
import {
  Upload,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { CustomNotificationManager } from "./custom-notification";
import { AuthButton } from "../auth/AuthButton";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { toasts, removeToast } = useCustomToast();
  const { user: authUser } = useAuth();
  const isSignedIn = !!authUser;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      if (!target.closest("nav")) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const mainNavItems = [
    { name: "Calculate", path: "/upload", icon: Upload },
    { name: "Help", path: "/how-to", icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMobileNavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-background/95 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-black/5"
            : "bg-background/70 backdrop-blur-md"
        }`}
      >
        {/* Subtle gradient overlay on scroll */}
        {scrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo with refined animation */}
            <div className="flex-shrink-0 group">
              <Link 
                to="/" 
                className="flex items-center transition-all duration-300 ease-out hover:scale-105"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fce60e853c9ae42db86e6ae486030dd51%2Fc64bbcd87f3648178e64a0dc160f6d67?format=webp&width=800"
                    alt="Taxfy Logo"
                    className="h-10 w-auto relative z-10 transition-all duration-300"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Center aligned with refined styling */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="flex items-center gap-2">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isCalc = item.name === "Calculate";
                  const itemActive = isActive(item.path);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      data-testid={`nav-${item.name.toLowerCase()}`}
                      className="group relative"
                    >
                      <Button
                        size="lg"
                        variant={isCalc ? "default" : "ghost"}
                        className={`
                          relative overflow-hidden
                          rounded-2xl px-6 py-2.5 h-auto
                          font-semibold tracking-tight
                          transition-all duration-300 ease-out
                          ${isCalc 
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105" 
                            : "hover:bg-muted/80 hover:scale-[1.02]"
                          }
                          ${itemActive && !isCalc ? "bg-muted/60" : ""}
                        `}
                      >
                        {/* Shine effect on hover for Calculate button */}
                        {isCalc && (
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        )}
                        
                        <Icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${isCalc ? 'group-hover:rotate-12' : 'group-hover:scale-110'}`} />
                        <span className="relative z-10">{item.name}</span>
                        
                        {/* Active indicator */}
                        {itemActive && !isCalc && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions with refined spacing */}
            <div className="flex items-center gap-3">
              {/* Desktop Auth Button */}
              <div className="hidden md:block">
                <AuthButton />
              </div>

              {/* Mobile Menu Button - Refined */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMobileMenuToggle}
                className={`
                  md:hidden relative
                  rounded-2xl p-2.5 h-auto
                  hover:bg-muted/80
                  transition-all duration-300 ease-out
                  ${isOpen ? 'bg-muted/60' : ''}
                `}
                data-testid="button-mobile-menu"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative w-5 h-5">
                  <Menu 
                    className={`
                      absolute inset-0 w-5 h-5
                      transition-all duration-300 ease-out
                      ${isOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}
                    `} 
                  />
                  <X 
                    className={`
                      absolute inset-0 w-5 h-5
                      transition-all duration-300 ease-out
                      ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}
                    `} 
                  />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Enhanced */}
          <div
            className={`
              md:hidden overflow-hidden
              transition-all duration-500 ease-out
              ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
            onClick={handleMobileNavClick}
          >
            <div className="py-6 space-y-3 border-t border-border/40">
              {mainNavItems.map((item, index) => {
                const Icon = item.icon;
                const itemActive = isActive(item.path);
                const isCalc = item.name === "Calculate";
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    className={`
                      flex items-center gap-3 px-4 py-3.5
                      rounded-2xl
                      font-medium tracking-tight
                      transition-all duration-300 ease-out
                      transform
                      ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                      ${isCalc
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : itemActive
                        ? 'bg-muted/80 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }
                    `}
                    style={{
                      transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <Icon className={`h-5 w-5 ${isCalc ? 'text-primary-foreground' : ''}`} />
                    <span className="text-base">{item.name}</span>
                    {itemActive && !isCalc && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}

              {/* Auth Section for Mobile */}
              <div 
                className={`
                  px-4 pt-4 mt-2 border-t border-border/40
                  transition-all duration-300
                  ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                `}
                style={{
                  transitionDelay: isOpen ? `${mainNavItems.length * 50}ms` : '0ms'
                }}
              >
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom Notification Manager */}
      <CustomNotificationManager toasts={toasts} removeToast={removeToast} />
    </>
  );
};
