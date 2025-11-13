import React from "react";

interface TaxfyLogoProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export const TaxfyLogo: React.FC<TaxfyLogoProps> = ({
  className = "",
  width = 64,
  height = 64,
  color = "currentColor",
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clean T shape without gradient */}
      <path
        d="M20 25 L100 25 L100 45 L70 45 L70 95 L50 95 L50 45 L20 45 Z"
        fill={color}
        className="fill-current"
      />
    </svg>
  );
};

export const TaxfyLogoWithText: React.FC<TaxfyLogoProps> = ({
  className = "",
  width = 120,
  height = 48,
  color = "currentColor",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <TaxfyLogo width={height} height={height} color={color} />
      <span className="text-xl font-bold">Taxfy</span>
    </div>
  );
};

export default TaxfyLogo;
