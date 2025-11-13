import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Temporarily disable smooth scrolling
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Scroll to top instantly
    window.scrollTo(0, 0);
    
    // Restore smooth scrolling after a brief delay
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior || 'smooth';
    }, 100);
  }, [pathname]);

  return null;
}; 