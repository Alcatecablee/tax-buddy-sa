// ✨ TAXFY HUB INSTANT SETUP - PASTE THIS ENTIRE SCRIPT INTO CONSOLE ✨
// This will instantly style your WordPress hub to match your React app

(function () {
  console.log("🚀 Starting Taxfy Hub styling...");

  // Design tokens from your React app
  const taxfyDesign = {
    colors: {
      background: "#0f0f0f",
      foreground: "#fafafa",
      primary: "#3399ff",
      secondary: "#262626",
      muted: "#a6a6a6",
      border: "rgba(38, 38, 38, 0.4)",
      card: "#262626",
    },
    fonts: {
      family:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  };

  // Create and inject CSS
  const css = `
/* 🎨 TAXFY HUB - INSTANT STYLING */

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Global dark theme override */
*, *::before, *::after {
    box-sizing: border-box;
}

html, body {
    background-color: ${taxfyDesign.colors.background} !important;
    color: ${taxfyDesign.colors.foreground} !important;
    font-family: ${taxfyDesign.fonts.family} !important;
    margin: 0;
    padding: 0;
}

/* Force dark theme on all elements */
body, 
.site-content,
.main-content,
.content-area,
.wrapper,
.container,
.docy-wrapper,
.site-wrapper {
    background-color: ${taxfyDesign.colors.background} !important;
    color: ${taxfyDesign.colors.foreground} !important;
}

/* Header and Navigation */
.site-header,
.main-header,
.navbar,
.header,
.docy-header,
header {
    background-color: rgba(15, 15, 15, 0.6) !important;
    backdrop-filter: blur(4px);
    border-bottom: 1px solid ${taxfyDesign.colors.border} !important;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

/* Navigation Links */
.nav-link,
.navbar-nav a,
.menu a,
.navigation a,
.main-nav a {
    color: ${taxfyDesign.colors.muted} !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    padding: 10px 16px !important;
    border-radius: 50px !important;
    transition: all 0.3s ease !important;
    text-decoration: none !important;
}

.nav-link:hover,
.navbar-nav a:hover,
.menu a:hover,
.navigation a:hover,
.main-nav a:hover {
    color: ${taxfyDesign.colors.foreground} !important;
    background-color: rgba(38, 38, 38, 0.5) !important;
}

.nav-link.active,
.navbar-nav .active a,
.menu .current-menu-item a,
.current-menu-item a {
    background-color: ${taxfyDesign.colors.primary} !important;
    color: ${taxfyDesign.colors.foreground} !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Cards and Content Blocks */
.card,
.post,
.article,
.widget,
.content-block,
.doc-item,
.knowledge-item,
.docy-card {
    background-color: ${taxfyDesign.colors.card} !important;
    border: 1px solid ${taxfyDesign.colors.border} !important;
    border-radius: 12px !important;
    padding: 24px !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    margin-bottom: 24px !important;
}

.card:hover,
.post:hover,
.article:hover,
.doc-item:hover,
.knowledge-item:hover,
.docy-card:hover {
    transform: scale(1.02) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
}

/* Buttons */
.btn,
.button,
.wp-block-button__link,
input[type="submit"],
button[type="submit"] {
    background-color: ${taxfyDesign.colors.primary} !important;
    color: ${taxfyDesign.colors.foreground} !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 24px !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    font-family: ${taxfyDesign.fonts.family} !important;
    transition: transform 0.3s ease !important;
    cursor: pointer !important;
    text-decoration: none !important;
}

.btn:hover,
.button:hover,
.wp-block-button__link:hover,
input[type="submit"]:hover,
button[type="submit"]:hover {
    transform: scale(1.05) !important;
    background-color: ${taxfyDesign.colors.primary} !important;
    color: ${taxfyDesign.colors.foreground} !important;
}

/* Forms and Inputs */
input,
textarea,
select,
.form-control,
.wp-block-search__input {
    background-color: ${taxfyDesign.colors.secondary} !important;
    border: 1px solid ${taxfyDesign.colors.border} !important;
    border-radius: 8px !important;
    color: ${taxfyDesign.colors.foreground} !important;
    padding: 12px 16px !important;
    font-family: ${taxfyDesign.fonts.family} !important;
    transition: border-color 0.3s ease !important;
}

input:focus,
textarea:focus,
select:focus,
.form-control:focus,
.wp-block-search__input:focus {
    border-color: ${taxfyDesign.colors.primary} !important;
    box-shadow: 0 0 0 3px rgba(51, 153, 255, 0.1) !important;
    outline: none !important;
}

/* Typography */
h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
    color: ${taxfyDesign.colors.foreground} !important;
    font-family: ${taxfyDesign.fonts.family} !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
}

p, div, span, li, td, th {
    color: ${taxfyDesign.colors.foreground} !important;
    font-family: ${taxfyDesign.fonts.family} !important;
}

a {
    color: ${taxfyDesign.colors.primary} !important;
    transition: color 0.3s ease !important;
}

a:hover {
    color: ${taxfyDesign.colors.foreground} !important;
}

/* Content area adjustments */
.content,
.main,
.site-main,
.main-content {
    padding-top: 80px !important;
    min-height: 100vh;
}

/* Sidebar */
.sidebar,
.widget-area {
    background-color: ${taxfyDesign.colors.card} !important;
    border-radius: 12px !important;
    padding: 24px !important;
}

/* Footer */
.footer,
.site-footer {
    background-color: ${taxfyDesign.colors.background} !important;
    border-top: 1px solid ${taxfyDesign.colors.border} !important;
    color: ${taxfyDesign.colors.muted} !important;
    padding: 48px 0 !important;
}

/* Search */
.search-form {
    position: relative;
}

.search-input,
.search-field {
    background-color: ${taxfyDesign.colors.secondary} !important;
    border: 1px solid ${taxfyDesign.colors.border} !important;
    border-radius: 12px !important;
    color: ${taxfyDesign.colors.foreground} !important;
    padding: 12px 16px 12px 48px !important;
    font-family: ${taxfyDesign.fonts.family} !important;
    width: 100% !important;
}

/* Responsive navigation */
@media (max-width: 768px) {
    .navbar-collapse,
    .mobile-menu {
        background-color: rgba(15, 15, 15, 0.95) !important;
        backdrop-filter: blur(4px);
        border: 1px solid ${taxfyDesign.colors.border} !important;
        border-radius: 12px !important;
        margin-top: 8px !important;
        padding: 16px !important;
    }
}

/* Override any theme-specific styles */
.docy-theme *,
.theme-docy * {
    background-color: inherit;
    color: inherit;
}

/* Force override any inline styles */
*[style*="background-color"],
*[style*="background"] {
    background-color: ${taxfyDesign.colors.background} !important;
}

*[style*="color: #"] {
    color: ${taxfyDesign.colors.foreground} !important;
}

/* Additional theme-specific overrides */
.wp-block-navigation ul {
    background-color: transparent !important;
}

.wp-block-navigation .wp-block-navigation-item a {
    color: ${taxfyDesign.colors.muted} !important;
}

.wp-block-navigation .wp-block-navigation-item a:hover {
    color: ${taxfyDesign.colors.foreground} !important;
}

/* Tables */
table {
    background-color: ${taxfyDesign.colors.card} !important;
    border: 1px solid ${taxfyDesign.colors.border} !important;
    border-radius: 8px !important;
}

th, td {
    border-color: ${taxfyDesign.colors.border} !important;
    color: ${taxfyDesign.colors.foreground} !important;
}

/* Code blocks */
pre, code {
    background-color: ${taxfyDesign.colors.secondary} !important;
    color: ${taxfyDesign.colors.foreground} !important;
    border: 1px solid ${taxfyDesign.colors.border} !important;
    border-radius: 6px !important;
}

/* Blockquotes */
blockquote {
    background-color: ${taxfyDesign.colors.card} !important;
    border-left: 4px solid ${taxfyDesign.colors.primary} !important;
    color: ${taxfyDesign.colors.foreground} !important;
    padding: 16px 24px !important;
    border-radius: 0 8px 8px 0 !important;
}
    `;

  // Inject the CSS
  const styleElement = document.createElement("style");
  styleElement.id = "taxfy-hub-instant-styles";
  styleElement.textContent = css;
  document.head.appendChild(styleElement);

  // Add cross-platform link
  const crossPlatformLink = document.createElement("div");
  crossPlatformLink.innerHTML = `
        <a href="https://taxfy.co.za" target="_blank" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${taxfyDesign.colors.primary};
            color: ${taxfyDesign.colors.foreground};
            padding: 12px 20px;
            border-radius: 12px;
            text-decoration: none;
            font-family: ${taxfyDesign.fonts.family};
            font-weight: 500;
            font-size: 14px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            🚀 Try Tax Calculator
        </a>
    `;
  document.body.appendChild(crossPlatformLink);

  // Force font loading
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(fontLink);

  // Save styles to localStorage for persistence
  localStorage.setItem("taxfy-hub-styles-applied", "true");
  localStorage.setItem("taxfy-hub-css", css);

  // Add smooth scrolling
  document.documentElement.style.scrollBehavior = "smooth";

  // Force re-render to apply styles
  document.body.style.display = "none";
  document.body.offsetHeight; // trigger reflow
  document.body.style.display = "";

  console.log("✅ Taxfy Hub styling applied successfully!");
  console.log("🎨 Your WordPress hub now matches your React app design");
  console.log("💾 Styles saved to localStorage for persistence");

  // Show success message
  const successMessage = document.createElement("div");
  successMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${taxfyDesign.colors.primary};
            color: ${taxfyDesign.colors.foreground};
            padding: 16px 24px;
            border-radius: 12px;
            font-family: ${taxfyDesign.fonts.family};
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.5s ease;
        ">
            ✅ Taxfy Hub styling applied! Your site now matches the React app.
        </div>
        <style>
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        </style>
    `;
  document.body.appendChild(successMessage);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
})();

console.log("🎯 Script loaded! Applying Taxfy styling to WordPress hub...");
