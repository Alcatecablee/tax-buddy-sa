import React from 'react';
import { Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="cursor-container py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section - Enhanced for mobile */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              {/* Logo image only - no rounded container */}
              <img 
                src="/assets/logo-ta.png" 
                alt="Taxfy Logo" 
                className="h-8 w-8 object-contain" 
              />
              <span className="text-xl font-bold text-blue-100">
                Taxfy
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The intelligent way to calculate your South African tax refund. Fast, accurate, and secure.
            </p>
            
            {/* Social Links - Enhanced for mobile */}
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-lg hover:bg-muted/50 transition-all duration-300 touch-target"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-lg hover:bg-muted/50 transition-all duration-300 touch-target"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 p-0 rounded-lg hover:bg-muted/50 transition-all duration-300 touch-target"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Links - Enhanced for mobile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/upload" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Upload Documents
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/manual-entry" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources - Enhanced for mobile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/how-to" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  How-To Guide
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Tax Guide & Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog/sars-tax-season-2025" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Tax Season 2025
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal - Enhanced for mobile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookie-policy" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/disclaimer" 
                  className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center py-1"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Enhanced for mobile */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/40">
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center justify-center sm:justify-start space-x-1 text-sm text-muted-foreground">
              <span>© {currentYear} Taxfy. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>in South Africa.</span>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center sm:justify-end space-x-4 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Status: All systems operational</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          
          {/* Additional Mobile Info */}
          <div className="mt-4 pt-4 border-t border-border/40 sm:hidden">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Trusted by 50,000+ South Africans
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <span>🔒 Bank-level security</span>
                <span>⚡ 30-second processing</span>
                <span>🇿🇦 SARS compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 