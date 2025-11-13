import React, { useState, useEffect } from 'react';
import { AnimatedLogo } from './animated-logo';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  size = 'md',
  fullScreen = true,
  className = ''
}) => {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-background"
    : "flex items-center justify-center p-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <AnimatedLogo size={size} />
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

// Animated text component for the auth loading screen
const AnimatedAuthText: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [dots, setDots] = useState('');
  const fullText = 'Warming up the refund engine';

  useEffect(() => {
    // Typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="text-sm text-white min-h-[20px] flex items-center">
      <span className="font-medium text-white">
        {displayText}
      </span>
      <span className="text-white animate-pulse ml-1 font-bold">
        {dots}
      </span>
    </div>
  );
};

// Specific loading screens for common use cases
export const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-6">
      <AnimatedLogo size="md" />
      <AnimatedAuthText />
    </div>
  </div>
);

export const DashboardLoadingScreen: React.FC = () => (
  <LoadingScreen message="Loading your dashboard..." />
);

export const ProfileLoadingScreen: React.FC = () => (
  <LoadingScreen message="Setting up your profile..." />
);

export const PageLoadingScreen: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingScreen message={message || "Loading page..."} />
); 