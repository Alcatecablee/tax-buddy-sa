import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmailConfirmation from "@/components/auth/EmailConfirmation";

const ConfirmEmail: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            to="/signin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </div>
        <EmailConfirmation />
      </div>
    </div>
  );
};

export default ConfirmEmail;
