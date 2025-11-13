import React, { useEffect } from "react";

interface AccessibilityEnhancerProps {
  children: React.ReactNode;
}

// Component to enhance accessibility throughout the app
const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({
  children,
}) => {
  useEffect(() => {
    // Skip to main content functionality
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + M to skip to main content
      if (event.altKey && event.key === "m") {
        event.preventDefault();
        const main =
          document.querySelector("main") ||
          document.querySelector('[role="main"]');
        if (main instanceof HTMLElement) {
          main.focus();
          main.scrollIntoView({ behavior: "smooth" });
        }
      }

      // Alt + N to skip to navigation
      if (event.altKey && event.key === "n") {
        event.preventDefault();
        const nav =
          document.querySelector("nav") ||
          document.querySelector('[role="navigation"]');
        if (nav instanceof HTMLElement) {
          const firstLink = nav.querySelector("a, button");
          if (firstLink instanceof HTMLElement) {
            firstLink.focus();
          }
        }
      }
    };

    // Add skip links if they don't exist
    const addSkipLinks = () => {
      if (!document.querySelector(".skip-links")) {
        const skipLinks = document.createElement("div");
        skipLinks.className = "skip-links sr-only focus:not-sr-only";
        skipLinks.innerHTML = `
          <style>
            .skip-links {
              position: fixed;
              top: 0;
              left: 0;
              z-index: 9999;
              background: hsl(var(--primary));
              color: hsl(var(--primary-foreground));
              padding: 1rem;
              border-radius: 0 0 0.5rem 0;
              transition: transform 0.3s ease;
              transform: translateY(-100%);
            }
            .skip-links:focus-within {
              transform: translateY(0);
            }
            .skip-links a {
              color: inherit;
              text-decoration: underline;
              margin-right: 1rem;
            }
          </style>
          <a href="#main-content">Skip to main content (Alt+M)</a>
          <a href="#navigation">Skip to navigation (Alt+N)</a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
      }
    };

    // Improve focus management
    const improveFocusManagement = () => {
      // Add focus-visible class for better focus indicators
      document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          document.body.classList.add("keyboard-navigation");
        }
      });

      document.addEventListener("mousedown", () => {
        document.body.classList.remove("keyboard-navigation");
      });

      // Add styles for keyboard navigation
      if (!document.querySelector("#keyboard-nav-styles")) {
        const styles = document.createElement("style");
        styles.id = "keyboard-nav-styles";
        styles.textContent = `
          .keyboard-navigation *:focus {
            outline: 2px solid hsl(var(--primary)) !important;
            outline-offset: 2px !important;
          }
          .keyboard-navigation *:focus:not(:focus-visible) {
            outline: none !important;
          }
        `;
        document.head.appendChild(styles);
      }
    };

    // Announce page changes for screen readers
    const announcePageChanges = () => {
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.className = "sr-only";
      announcer.id = "page-announcer";
      document.body.appendChild(announcer);
    };

    addSkipLinks();
    improveFocusManagement();
    announcePageChanges();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
};

// Utility function to announce messages to screen readers
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite",
) => {
  const announcer = document.getElementById("page-announcer");
  if (announcer) {
    announcer.setAttribute("aria-live", priority);
    announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = "";
    }, 1000);
  }
};

export default AccessibilityEnhancer;
