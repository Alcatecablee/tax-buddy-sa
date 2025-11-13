import React from "react";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="bg-slate-800 text-slate-300 py-12" role="contentinfo">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src="/vite.svg" 
            alt="Taxfy Logo" 
            className="h-8 w-8" 
          />
          <span className="text-xl font-bold text-white">Taxfy</span>
        </div>
        <p className="text-gray-300 mt-2">
          © 2024 Taxfy. Simplifying South African tax planning.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
