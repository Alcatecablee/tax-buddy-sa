import React from "react";

interface SiteLoaderProps {
  isLoading?: boolean;
  message?: string;
}

export const SiteLoader: React.FC<SiteLoaderProps> = ({
  isLoading = true,
  message = "Loading Taxfy...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Simple Logo */}
        <div className="flex items-center justify-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800"
            alt="Taxfy Logo"
            className="w-32 h-32 object-contain animate-bounce"
          />
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground animate-pulse">
            {message}
          </h3>

          {/* Loading bar */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-loading-bar"></div>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mini loader for smaller spaces
export const MiniLoader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const logoSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center">
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2Fcf377e0bd4bd46bca00d7f475401ff8c%2F10f921e8d0be49edbed7abd726ef8a5f?format=webp&width=800"
        alt="Taxfy Logo"
        className={`${logoSizes[size]} object-contain animate-pulse`}
      />
    </div>
  );
};

export default SiteLoader;
