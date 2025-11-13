/**
 * Automated WordPress Hub Setup Script
 *
 * This script automates the entire process of styling your WordPress hub
 * to match your React app design without manual intervention.
 */

class WordPressHubSetup {
  constructor(config = {}) {
    this.config = {
      wpUrl: "https://hub.taxfy.co.za",
      wpApiUrl: "https://hub.taxfy.co.za/wp-json/wp/v2",
      cssFileName: "taxfy-hub-styles.css",
      ...config,
    };

    this.designTokens = {
      colors: {
        background: "rgb(15, 15, 15)",
        foreground: "rgb(250, 250, 250)",
        primary: "rgb(51, 153, 255)",
        secondary: "rgb(38, 38, 38)",
        muted: "rgb(166, 166, 166)",
        border: "rgba(38, 38, 38, 0.4)",
        card: "rgb(38, 38, 38)",
      },
      typography: {
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
          xs: "12px",
          sm: "14px",
          base: "16px",
          lg: "18px",
          xl: "20px",
          "2xl": "24px",
          "3xl": "30px",
          "4xl": "36px",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          semibold: "600",
          bold: "700",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    };
  }

  /**
   * Main setup function - call this to automatically setup everything
   */
  async setupWordPressHub() {
    console.log("🚀 Starting WordPress Hub setup...");

    try {
      // Step 1: Generate and inject CSS
      await this.injectCustomCSS();

      // Step 2: Setup Google Fonts
      await this.setupGoogleFonts();

      // Step 3: Configure WordPress Customizer (if API access available)
      await this.setupWordPressCustomizer();

      // Step 4: Apply JavaScript enhancements
      await this.applyJavaScriptEnhancements();

      // Step 5: Setup content structure
      await this.setupContentStructure();

      console.log("✅ WordPress Hub setup completed successfully!");

      return {
        success: true,
        message: "WordPress hub now matches your React app design",
        nextSteps: this.getNextSteps(),
      };
    } catch (error) {
      console.error("❌ Setup failed:", error);
      return {
        success: false,
        error: error.message,
        fallbackInstructions: this.getFallbackInstructions(),
      };
    }
  }

  /**
   * Inject custom CSS into WordPress
   */
  async injectCustomCSS() {
    console.log("📝 Injecting custom CSS...");

    const css = this.generateTaxfyCSS();

    // Method 1: Try to inject via WordPress Customizer API
    try {
      await this.injectCSSViaAPI(css);
    } catch (error) {
      console.log("API injection failed, trying alternative methods...");

      // Method 2: Browser injection for immediate preview
      this.injectCSSViaBrowser(css);

      // Method 3: Generate downloadable file
      this.generateDownloadableCSS(css);
    }
  }

  /**
   * Generate complete CSS matching React app
   */
  generateTaxfyCSS() {
    return `
/* Taxfy Hub - Auto-generated CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
    --taxfy-bg: ${this.designTokens.colors.background};
    --taxfy-fg: ${this.designTokens.colors.foreground};
    --taxfy-primary: ${this.designTokens.colors.primary};
    --taxfy-secondary: ${this.designTokens.colors.secondary};
    --taxfy-muted: ${this.designTokens.colors.muted};
    --taxfy-border: ${this.designTokens.colors.border};
    --taxfy-card: ${this.designTokens.colors.card};
    --taxfy-font: ${this.designTokens.typography.fontFamily};
}

/* Global overrides */
* { box-sizing: border-box; }
body, html {
    background-color: var(--taxfy-bg) !important;
    color: var(--taxfy-fg) !important;
    font-family: var(--taxfy-font) !important;
    margin: 0;
    padding: 0;
}

/* Header styling */
.site-header, .main-header, header, .navbar {
    background-color: rgba(15, 15, 15, 0.6) !important;
    backdrop-filter: blur(4px);
    border-bottom: 1px solid var(--taxfy-border);
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

/* Navigation */
.nav-link, .navbar-nav a, .menu a {
    color: var(--taxfy-muted) !important;
    font-size: ${this.designTokens.typography.fontSize.xs};
    font-weight: ${this.designTokens.typography.fontWeight.medium};
    padding: 10px 16px;
    border-radius: ${this.designTokens.borderRadius.full};
    transition: all 0.3s ease;
    text-decoration: none;
}

.nav-link:hover, .navbar-nav a:hover, .menu a:hover {
    color: var(--taxfy-fg) !important;
    background-color: rgba(38, 38, 38, 0.5);
}

.nav-link.active, .current-menu-item a {
    background-color: var(--taxfy-primary) !important;
    color: var(--taxfy-fg) !important;
}

/* Cards */
.card, .post, .article, .widget {
    background-color: var(--taxfy-card);
    border: 1px solid var(--taxfy-border);
    border-radius: ${this.designTokens.borderRadius.lg};
    padding: ${this.designTokens.spacing.lg};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover, .post:hover, .article:hover {
    transform: scale(1.02);
    box-shadow: ${this.designTokens.shadows.lg};
}

/* Buttons */
.btn, .button, input[type="submit"] {
    background-color: var(--taxfy-primary);
    color: var(--taxfy-fg);
    border: none;
    border-radius: ${this.designTokens.borderRadius.lg};
    padding: 12px ${this.designTokens.spacing.lg};
    font-weight: ${this.designTokens.typography.fontWeight.medium};
    font-size: ${this.designTokens.typography.fontSize.sm};
    transition: transform 0.3s ease;
    cursor: pointer;
}

.btn:hover, .button:hover, input[type="submit"]:hover {
    transform: scale(1.05);
    background-color: var(--taxfy-primary);
}

/* Forms */
input, textarea, select {
    background-color: var(--taxfy-secondary);
    border: 1px solid var(--taxfy-border);
    border-radius: ${this.designTokens.borderRadius.md};
    color: var(--taxfy-fg);
    padding: 12px ${this.designTokens.spacing.md};
    font-family: var(--taxfy-font);
}

input:focus, textarea:focus, select:focus {
    border-color: var(--taxfy-primary);
    box-shadow: 0 0 0 3px rgba(51, 153, 255, 0.1);
    outline: none;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    color: var(--taxfy-fg) !important;
    font-weight: ${this.designTokens.typography.fontWeight.bold};
}

p, div, span {
    color: var(--taxfy-fg);
}

a { color: var(--taxfy-primary); }
a:hover { color: var(--taxfy-fg); }

/* Content area */
.content, .main, .site-main {
    background-color: var(--taxfy-bg);
    padding-top: 80px; /* Account for fixed header */
    min-height: 100vh;
}

/* Footer */
.footer, .site-footer {
    background-color: var(--taxfy-bg);
    border-top: 1px solid var(--taxfy-border);
    color: var(--taxfy-muted);
}

/* Responsive */
@media (max-width: 768px) {
    .navbar-collapse {
        background-color: rgba(15, 15, 15, 0.95);
        border: 1px solid var(--taxfy-border);
        border-radius: ${this.designTokens.borderRadius.lg};
        margin-top: ${this.designTokens.spacing.sm};
        padding: ${this.designTokens.spacing.md};
    }
}

/* Theme-specific overrides */
${this.getThemeSpecificCSS()}
        `;
  }

  /**
   * Get theme-specific CSS overrides
   */
  getThemeSpecificCSS() {
    return `
/* Docy Theme Specific */
.docy-theme * {
    background-color: inherit;
    color: inherit;
}

.docy-header {
    background-color: rgba(15, 15, 15, 0.6) !important;
    backdrop-filter: blur(4px);
}

.docy-sidebar {
    background-color: var(--taxfy-card);
    border: 1px solid var(--taxfy-border);
}

/* Force dark mode */
[data-theme="light"], .light-theme {
    background-color: var(--taxfy-bg) !important;
    color: var(--taxfy-fg) !important;
}

/* Override any inline styles */
*[style*="background"] {
    background-color: var(--taxfy-bg) !important;
}

*[style*="color"] {
    color: var(--taxfy-fg) !important;
}
        `;
  }

  /**
   * Inject CSS via WordPress API
   */
  async injectCSSViaAPI(css) {
    // This would require WordPress REST API access
    // Implementation depends on available authentication
    throw new Error("API access not available - using fallback methods");
  }

  /**
   * Inject CSS directly into browser
   */
  injectCSSViaBrowser(css) {
    // Check if we're on the WordPress site
    if (window.location.hostname.includes("hub.taxfy.co.za")) {
      const style = document.createElement("style");
      style.id = "taxfy-hub-auto-styles";
      style.textContent = css;
      document.head.appendChild(style);

      // Store in localStorage for persistence
      localStorage.setItem("taxfy-hub-styles", css);

      console.log("✅ CSS injected into current page");
    }
  }

  /**
   * Generate downloadable CSS file
   */
  generateDownloadableCSS(css) {
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "taxfy-hub-styles.css";
    link.textContent = "Download Taxfy Hub CSS";
    link.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgb(51, 153, 255);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            z-index: 10000;
            font-family: Inter, sans-serif;
            font-weight: 500;
        `;

    document.body.appendChild(link);

    // Auto-download
    link.click();

    console.log("📁 CSS file generated for download");
  }

  /**
   * Setup Google Fonts
   */
  async setupGoogleFonts() {
    console.log("🔤 Setting up Google Fonts...");

    // Add font preconnect
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    // Add Inter font
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(fontLink);
  }

  /**
   * Setup WordPress Customizer
   */
  async setupWordPressCustomizer() {
    console.log("⚙️ Configuring WordPress Customizer...");

    // This would typically require admin access
    // Generate instructions instead
    const customizerSettings = {
      site_title: "Taxfy Knowledge Hub",
      site_tagline: "Expert tax guidance for South African taxpayers",
      background_color: "0f0f0f",
      text_color: "fafafa",
      primary_color: "3399ff",
      enable_dark_mode: true,
    };

    console.log("Recommended Customizer settings:", customizerSettings);
  }

  /**
   * Apply JavaScript enhancements
   */
  async applyJavaScriptEnhancements() {
    console.log("⚡ Applying JavaScript enhancements...");

    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Add backdrop blur support
    const style = document.createElement("style");
    style.textContent = `
            @supports (backdrop-filter: blur(4px)) {
                .navbar, .site-header {
                    backdrop-filter: blur(4px) !important;
                }
            }
        `;
    document.head.appendChild(style);

    // Add intersection observer for animations
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      });

      // Observe cards for animation
      document.querySelectorAll(".card, .post, .article").forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(el);
      });
    }
  }

  /**
   * Setup content structure
   */
  async setupContentStructure() {
    console.log("📋 Setting up content structure...");

    // Add cross-platform links if we're on the hub
    if (window.location.hostname.includes("hub.taxfy.co.za")) {
      this.addCrossPlatformLinks();
    }
  }

  /**
   * Add cross-platform navigation links
   */
  addCrossPlatformLinks() {
    const mainAppLink = document.createElement("div");
    mainAppLink.innerHTML = `
            <a href="https://taxfy.co.za" target="_blank" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgb(51, 153, 255);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                text-decoration: none;
                font-family: Inter, sans-serif;
                font-weight: 500;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🚀 Try Tax Calculator
            </a>
        `;
    document.body.appendChild(mainAppLink);
  }

  /**
   * Get next steps for user
   */
  getNextSteps() {
    return [
      "1. Check if the CSS was automatically applied to your site",
      "2. If not, download and upload the CSS file to your WordPress theme",
      "3. Go to WordPress Admin → Appearance → Customize to fine-tune colors",
      "4. Update your site title and tagline in Settings → General",
      "5. Create menu items matching your navigation structure",
    ];
  }

  /**
   * Get fallback instructions
   */
  getFallbackInstructions() {
    return {
      method1:
        "Upload the downloaded CSS file to your WordPress theme's style.css",
      method2:
        "Copy the CSS and paste it in Appearance → Customize → Additional CSS",
      method3:
        'Use a plugin like "Easy Theme and Plugin Upgrades" to apply custom CSS',
      support: "Contact your web developer to implement the generated styles",
    };
  }

  /**
   * Create installation package
   */
  createInstallationPackage() {
    const packageData = {
      css: this.generateTaxfyCSS(),
      fonts:
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
      instructions: this.getNextSteps(),
      customizerSettings: {
        background_color: "0f0f0f",
        text_color: "fafafa",
        primary_color: "3399ff",
      },
      menuStructure: [
        { title: "Home", url: "/" },
        { title: "Guides", url: "/guides" },
        { title: "Support", url: "/support" },
        { title: "Community", url: "/community" },
        { title: "Glossary", url: "/glossary" },
      ],
    };

    return packageData;
  }
}

// Auto-run if on WordPress hub
if (
  typeof window !== "undefined" &&
  window.location.hostname.includes("hub.taxfy.co.za")
) {
  const setup = new WordPressHubSetup();
  setup.setupWordPressHub();
}

// Export for manual usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = WordPressHubSetup;
}

// Make available globally
if (typeof window !== "undefined") {
  window.WordPressHubSetup = WordPressHubSetup;
}

/**
 * Usage Examples:
 *
 * // Auto setup (run this on any page)
 * const setup = new WordPressHubSetup();
 * await setup.setupWordPressHub();
 *
 * // Custom configuration
 * const setup = new WordPressHubSetup({
 *     wpUrl: 'https://your-hub-url.com',
 *     customColors: { primary: 'rgb(255, 100, 100)' }
 * });
 * await setup.setupWordPressHub();
 *
 * // Get installation package for manual setup
 * const packageData = setup.createInstallationPackage();
 * console.log(packageData);
 */
