import React from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-28 w-28'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Logo image only - no circles */}
      <img 
        src="/assets/logo-ta.png" 
        alt="Taxfy Logo" 
        className={`${sizeClasses[size]} object-contain animate-bounce-subtle`} 
      />
    </div>
  );
};

// Add custom animations to your global CSS or create a separate CSS file
export const AnimatedLogoStyles = `
  @keyframes bounce-subtle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 1.5s ease-in-out infinite;
  }
`; 