import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UserDropdown: React.FC<{ user: any }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeDropdown();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full p-0"
        onClick={toggleDropdown}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.user_metadata?.avatar_url}
            alt={user.user_metadata?.full_name || "User"}
          />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <div className="flex flex-col space-y-1">
              {user.user_metadata?.full_name && (
                <p className="font-medium text-sm">
                  {user.user_metadata.full_name}
                </p>
              )}
              {user.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="py-1">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
              onClick={closeDropdown}
            >
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Link>

            <button
              className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AuthButton: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <LogIn className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Link to="/signin">
        <Button variant="outline" size="sm">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </Link>
    );
  }

  return <UserDropdown user={user} />;
};
