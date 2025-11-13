import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ClickableTagProps {
  tag: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ClickableTag: React.FC<ClickableTagProps> = ({
  tag,
  variant = "outline",
  size = "sm",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleTagClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <Badge
      variant={variant}
      className={`cursor-pointer hover:scale-105 transition-all ${sizeClasses[size]} ${className}`}
      onClick={handleTagClick}
      title={`View all articles tagged with "${tag}"`}
    >
      {tag}
    </Badge>
  );
};

export default ClickableTag;
