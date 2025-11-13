import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SiteLoader } from "./ui/site-loader";

interface AuthLoadingWrapperProps {
  children: React.ReactNode;
}

export const AuthLoadingWrapper: React.FC<AuthLoadingWrapperProps> = ({
  children,
}) => {
  const { loading } = useAuth();

  if (loading) {
    return <SiteLoader message="Initializing Taxfy..." />;
  }

  return <>{children}</>;
};

export default AuthLoadingWrapper;
