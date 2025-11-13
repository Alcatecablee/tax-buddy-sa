/**
 * Taxfy Cross-Platform Manager - Frontend JavaScript
 * Handles cross-platform functionality on the WordPress hub
 */

(function ($) {
  "use strict";

  // Global configuration
  const TaxfyCrossPlatform = {
    settings: {},
    initialized: false,
    analytics: {
      sessionId: null,
      events: [],
      pageStartTime: Date.now(),
    },
  };

  // Initialize when document is ready
  $(document).ready(function () {
    init();
  });

  /**
   * Initialize cross-platform functionality
   */
  function init() {
    console.log("🔗 Initializing Taxfy Cross-Platform features...");

    // Load settings
    loadSettings();

    // Initialize analytics
    initAnalytics();

    // Set up cross-platform navigation
    setupCrossPlatformNavigation();

    // Initialize theme enhancements
    initThemeEnhancements();

    // Set up performance monitoring
    setupPerformanceMonitoring();

    // Initialize user session tracking
    initSessionTracking();

    // Set up search enhancements
    setupSearchEnhancements();

    // Initialize accessibility features
    initAccessibilityFeatures();

    TaxfyCrossPlatform.initialized = true;
    console.log("✅ Cross-platform features initialized");

    // Track page load
    trackEvent("page_load", {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    });
  }

  /**
   * Load settings from localized script
   */
  function loadSettings() {
    if (typeof taxfy_frontend !== "undefined") {
      TaxfyCrossPlatform.settings = taxfy_frontend;
    }
  }

  /**
   * Initialize analytics
   */
  function initAnalytics() {
    // Generate session ID
    TaxfyCrossPlatform.analytics.sessionId = generateSessionId();

    // Track page views
    trackPageView();

    // Set up scroll tracking
    setupScrollTracking();

    // Set up click tracking
    setupClickTracking();

    // Set up time on page tracking
    setupTimeTracking();

    // Send analytics data periodically
    setInterval(sendAnalyticsData, 30000); // Every 30 seconds

    // Send data on page unload
    window.addEventListener("beforeunload", sendAnalyticsData);
  }

  /**
   * Set up cross-platform navigation
   */
  function setupCrossPlatformNavigation() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Enhance the floating CTA
    enhanceFloatingCTA();

    // Add navigation hints
    addNavigationHints();

    // Set up breadcrumb enhancements
    enhanceBreadcrumbs();

    // Initialize mobile navigation improvements
    enhanceMobileNavigation();
  }

  /**
   * Enhance floating CTA
   */
  function enhanceFloatingCTA() {
    const floatingCTA = document.querySelector(".taxfy-floating-cta");
    if (!floatingCTA) return;

    // Add interaction tracking
    floatingCTA.addEventListener("click", function (e) {
      trackEvent("cta_click", {
        source: "floating_button",
        destination: "react_app",
        page: window.location.pathname,
      });

      // Add subtle animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });

    // Add hover effects
    floatingCTA.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05) translateY(-2px)";
      this.style.boxShadow = "0 12px 35px rgba(51, 153, 255, 0.4)";
    });

    floatingCTA.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0)";
      this.style.boxShadow = "0 8px 25px rgba(51, 153, 255, 0.3)";
    });

    // Hide on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", function () {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        floatingCTA.style.transform = "translateY(100px)";
        floatingCTA.style.opacity = "0";
      } else {
        // Scrolling up
        floatingCTA.style.transform = "translateY(0)";
        floatingCTA.style.opacity = "1";
      }

      lastScrollY = currentScrollY;
    });
  }

  /**
   * Add navigation hints
   */
  function addNavigationHints() {
    // Add tooltips to navigation items
    const navItems = document.querySelectorAll(".nav-link, .menu a");
    navItems.forEach((item) => {
      if (!item.hasAttribute("title")) {
        const text = item.textContent.trim();
        if (text) {
          item.setAttribute("title", `Navigate to ${text}`);
        }
      }
    });

    // Add external link indicators
    const externalLinks = document.querySelectorAll(
      'a[href^="http"]:not([href*="' + window.location.hostname + '"])',
    );
    externalLinks.forEach((link) => {
      if (!link.querySelector(".external-icon")) {
        const icon = document.createElement("span");
        icon.className = "external-icon";
        icon.innerHTML = " ↗";
        icon.style.fontSize = "0.8em";
        icon.style.opacity = "0.7";
        link.appendChild(icon);
      }
    });
  }

  /**
   * Enhance breadcrumbs
   */
  function enhanceBreadcrumbs() {
    const breadcrumbs = document.querySelector(".breadcrumb, .breadcrumbs");
    if (!breadcrumbs) return;

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    };

    const breadcrumbItems = breadcrumbs.querySelectorAll("a, .current");
    breadcrumbItems.forEach((item, index) => {
      structuredData.itemListElement.push({
        "@type": "ListItem",
        position: index + 1,
        name: item.textContent.trim(),
        item: item.href || window.location.href,
      });
    });

    // Inject structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Enhance mobile navigation
   */
  function enhanceMobileNavigation() {
    // Add touch gesture support
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", function (e) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Swipe right to go to React app (from left edge)
      if (deltaX > 100 && Math.abs(deltaY) < 50 && touchStartX < 50) {
        trackEvent("swipe_navigation", {
          direction: "right",
          destination: "react_app",
        });

        if (TaxfyCrossPlatform.settings.react_app_url) {
          window.open(TaxfyCrossPlatform.settings.react_app_url, "_blank");
        }
      }
    });
  }

  /**
   * Initialize theme enhancements
   */
  function initThemeEnhancements() {
    // Add CSS custom properties for dynamic theming
    addCustomProperties();

    // Enhance form interactions
    enhanceFormInteractions();

    // Add loading states
    addLoadingStates();

    // Initialize scroll animations
    initScrollAnimations();

    // Set up responsive image loading
    setupResponsiveImages();
  }

  /**
   * Add CSS custom properties
   */
  function addCustomProperties() {
    const root = document.documentElement;

    // Add dynamic properties based on system preferences
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      root.style.setProperty("--animation-duration", "0.01ms");
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-contrast: high)").matches
    ) {
      root.style.setProperty("--border-width", "2px");
    }
  }

  /**
   * Enhance form interactions
   */
  function enhanceFormInteractions() {
    // Add floating labels
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      if (input.type !== "submit" && input.type !== "button") {
        addFloatingLabel(input);
      }
    });

    // Add form validation feedback
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      addValidationFeedback(form);
    });
  }

  /**
   * Add floating label
   */
  function addFloatingLabel(input) {
    if (input.closest(".floating-label")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "floating-label";

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Add focus/blur handlers
    input.addEventListener("focus", function () {
      wrapper.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!input.value) {
        wrapper.classList.remove("focused");
      }
    });

    // Check initial state
    if (input.value) {
      wrapper.classList.add("focused");
    }
  }

  /**
   * Add validation feedback
   */
  function addValidationFeedback(form) {
    form.addEventListener("submit", function (e) {
      const invalidFields = form.querySelectorAll(":invalid");

      if (invalidFields.length > 0) {
        e.preventDefault();

        invalidFields.forEach((field) => {
          addFieldError(field);
        });

        // Focus first invalid field
        invalidFields[0].focus();

        trackEvent("form_validation_error", {
          form: form.className || form.id || "unknown",
          errors: invalidFields.length,
        });
      }
    });
  }

  /**
   * Add field error
   */
  function addFieldError(field) {
    // Remove existing error
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const error = document.createElement("div");
    error.className = "field-error";
    error.textContent = field.validationMessage;
    error.style.color = "#ef4444";
    error.style.fontSize = "0.875rem";
    error.style.marginTop = "0.25rem";

    field.parentNode.appendChild(error);

    // Remove error on input
    field.addEventListener(
      "input",
      function () {
        error.remove();
      },
      { once: true },
    );
  }

  /**
   * Add loading states
   */
  function addLoadingStates() {
    // Add loading to form submissions
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", function () {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          addLoadingState(submitBtn);
        }
      });
    });

    // Add loading to AJAX links
    const ajaxLinks = document.querySelectorAll("[data-ajax]");
    ajaxLinks.forEach((link) => {
      link.addEventListener("click", function () {
        addLoadingState(this);
      });
    });
  }

  /**
   * Add loading state to element
   */
  function addLoadingState(element) {
    const originalText = element.textContent;
    element.disabled = true;
    element.textContent = "Loading...";

    // Add spinner
    const spinner = document.createElement("span");
    spinner.className = "loading-spinner";
    spinner.innerHTML = " ⟳";
    spinner.style.animation = "spin 1s linear infinite";
    element.appendChild(spinner);

    // Remove loading state after 5 seconds (fallback)
    setTimeout(() => {
      removeLoadingState(element, originalText);
    }, 5000);
  }

  /**
   * Remove loading state
   */
  function removeLoadingState(element, originalText) {
    element.disabled = false;
    element.textContent = originalText;

    const spinner = element.querySelector(".loading-spinner");
    if (spinner) {
      spinner.remove();
    }
  }

  /**
   * Initialize scroll animations
   */
  function initScrollAnimations() {
    // Use Intersection Observer for better performance
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";

              // Track element visibility
              trackEvent("element_visible", {
                element: entry.target.tagName.toLowerCase(),
                class: entry.target.className,
              });
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      // Observe cards and content blocks
      const animatedElements = document.querySelectorAll(
        ".card, .post, .article, .widget",
      );
      animatedElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(el);
      });
    }
  }

  /**
   * Set up responsive images
   */
  function setupResponsiveImages() {
    // Add lazy loading to images
    const images = document.querySelectorAll("img:not([loading])");
    images.forEach((img) => {
      img.loading = "lazy";
    });

    // Add WebP support detection
    const supportsWebP = (function () {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").indexOf("webp") > -1;
    })();

    if (supportsWebP) {
      document.documentElement.classList.add("webp-support");
    }
  }

  /**
   * Set up performance monitoring
   */
  function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener("load", function () {
      if ("performance" in window) {
        const perfData = performance.getEntriesByType("navigation")[0];

        trackEvent("performance", {
          loadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded:
            perfData.domContentLoadedEventEnd - perfData.fetchStart,
          firstPaint: getFirstPaint(),
          connection: getConnectionInfo(),
        });
      }
    });

    // Monitor Core Web Vitals
    if ("PerformanceObserver" in window) {
      monitorCoreWebVitals();
    }
  }

  /**
   * Get first paint time
   */
  function getFirstPaint() {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find(
      (entry) => entry.name === "first-paint",
    );
    return firstPaint ? firstPaint.startTime : null;
  }

  /**
   * Get connection information
   */
  function getConnectionInfo() {
    if ("connection" in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
      };
    }
    return null;
  }

  /**
   * Monitor Core Web Vitals
   */
  function monitorCoreWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      trackEvent("core_web_vitals", {
        metric: "LCP",
        value: lastEntry.startTime,
      });
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        trackEvent("core_web_vitals", {
          metric: "FID",
          value: entry.processingStart - entry.startTime,
        });
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      trackEvent("core_web_vitals", {
        metric: "CLS",
        value: clsValue,
      });
    }).observe({ entryTypes: ["layout-shift"] });
  }

  /**
   * Initialize session tracking
   */
  function initSessionTracking() {
    // Track session start
    trackEvent("session_start", {
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
    });

    // Track session duration
    let sessionStartTime = Date.now();

    window.addEventListener("beforeunload", function () {
      trackEvent("session_end", {
        duration: Date.now() - sessionStartTime,
        timestamp: Date.now(),
      });
    });

    // Track user engagement
    let isEngaged = false;
    let engagementStartTime = null;

    // Mouse movement indicates engagement
    document.addEventListener("mousemove", function () {
      if (!isEngaged) {
        isEngaged = true;
        engagementStartTime = Date.now();
      }
    });

    // No mouse movement for 30 seconds = disengaged
    let disengagementTimer;
    document.addEventListener("mousemove", function () {
      clearTimeout(disengagementTimer);
      disengagementTimer = setTimeout(() => {
        if (isEngaged && engagementStartTime) {
          trackEvent("engagement", {
            duration: Date.now() - engagementStartTime,
            type: "mouse_idle",
          });
          isEngaged = false;
          engagementStartTime = null;
        }
      }, 30000);
    });
  }

  /**
   * Set up search enhancements
   */
  function setupSearchEnhancements() {
    const searchInputs = document.querySelectorAll(
      'input[type="search"], .search-field',
    );

    searchInputs.forEach((input) => {
      // Add search suggestions
      addSearchSuggestions(input);

      // Track search queries
      input.addEventListener(
        "input",
        debounce(function () {
          if (this.value.length > 2) {
            trackEvent("search_query", {
              query: this.value,
              length: this.value.length,
            });
          }
        }, 500),
      );
    });
  }

  /**
   * Add search suggestions
   */
  function addSearchSuggestions(input) {
    const suggestions = [
      "tax deductions",
      "SARS eFiling",
      "IRP5 analysis",
      "provisional tax",
      "freelancer tax",
      "VAT registration",
      "medical aid tax",
      "retirement annuity",
    ];

    const suggestionsList = document.createElement("div");
    suggestionsList.className = "search-suggestions";
    suggestionsList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;

    input.parentNode.style.position = "relative";
    input.parentNode.appendChild(suggestionsList);

    input.addEventListener("input", function () {
      const query = this.value.toLowerCase();

      if (query.length < 2) {
        suggestionsList.style.display = "none";
        return;
      }

      const matches = suggestions.filter((s) => s.includes(query));

      if (matches.length > 0) {
        suggestionsList.innerHTML = matches
          .map(
            (match) =>
              `<div class="suggestion-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #f3f4f6;">${match}</div>`,
          )
          .join("");

        suggestionsList.style.display = "block";

        // Add click handlers
        suggestionsList.querySelectorAll(".suggestion-item").forEach((item) => {
          item.addEventListener("click", function () {
            input.value = this.textContent;
            suggestionsList.style.display = "none";

            trackEvent("search_suggestion_click", {
              suggestion: this.textContent,
              original_query: query,
            });
          });
        });
      } else {
        suggestionsList.style.display = "none";
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", function (e) {
      if (!input.parentNode.contains(e.target)) {
        suggestionsList.style.display = "none";
      }
    });
  }

  /**
   * Initialize accessibility features
   */
  function initAccessibilityFeatures() {
    // Add skip links
    addSkipLinks();

    // Enhance keyboard navigation
    enhanceKeyboardNavigation();

    // Add focus indicators
    addFocusIndicators();

    // Set up screen reader announcements
    setupScreenReaderAnnouncements();
  }

  /**
   * Add skip links
   */
  function addSkipLinks() {
    const skipLinks = document.createElement("div");
    skipLinks.className = "skip-links";
    skipLinks.innerHTML = `
            <a href="#main" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `;

    skipLinks.style.cssText = `
            position: absolute;
            top: -1000px;
            left: -1000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;

    // Show on focus
    skipLinks.querySelectorAll(".skip-link").forEach((link) => {
      link.addEventListener("focus", function () {
        this.parentNode.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: auto;
                    height: auto;
                    overflow: visible;
                    z-index: 100000;
                `;

        this.style.cssText = `
                    display: block;
                    padding: 10px;
                    background: #000;
                    color: #fff;
                    text-decoration: none;
                    font-weight: bold;
                `;
      });

      link.addEventListener("blur", function () {
        this.parentNode.style.cssText = `
                    position: absolute;
                    top: -1000px;
                    left: -1000px;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                `;
      });
    });

    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  /**
   * Enhance keyboard navigation
   */
  function enhanceKeyboardNavigation() {
    // Add keyboard shortcuts
    document.addEventListener("keydown", function (e) {
      // Alt + R: Go to React app
      if (e.altKey && e.key === "r") {
        e.preventDefault();
        if (TaxfyCrossPlatform.settings.react_app_url) {
          window.open(TaxfyCrossPlatform.settings.react_app_url, "_blank");
          trackEvent("keyboard_shortcut", {
            shortcut: "alt_r",
            action: "react_app",
          });
        }
      }

      // Alt + S: Focus search
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="search"], .search-field',
        );
        if (searchInput) {
          searchInput.focus();
          trackEvent("keyboard_shortcut", {
            shortcut: "alt_s",
            action: "focus_search",
          });
        }
      }
    });
  }

  /**
   * Add focus indicators
   */
  function addFocusIndicators() {
    const focusStyle = document.createElement("style");
    focusStyle.textContent = `
            .js-focus-visible :focus:not(.focus-visible) {
                outline: none;
            }
            .js-focus-visible .focus-visible {
                outline: 2px solid #3399ff;
                outline-offset: 2px;
            }
        `;
    document.head.appendChild(focusStyle);

    document.documentElement.classList.add("js-focus-visible");
  }

  /**
   * Set up screen reader announcements
   */
  function setupScreenReaderAnnouncements() {
    const announcer = document.createElement("div");
    announcer.id = "taxfy-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
    document.body.appendChild(announcer);

    // Function to announce messages
    window.announceToScreenReader = function (message) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = "";
      }, 1000);
    };
  }

  /**
   * Set up scroll tracking
   */
  function setupScrollTracking() {
    let maxScroll = 0;
    let scrollMilestones = [25, 50, 75, 100];
    let trackedMilestones = [];

    window.addEventListener(
      "scroll",
      debounce(function () {
        const scrollPercent = Math.round(
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
            100,
        );

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
        }

        // Track milestones
        scrollMilestones.forEach((milestone) => {
          if (
            scrollPercent >= milestone &&
            !trackedMilestones.includes(milestone)
          ) {
            trackedMilestones.push(milestone);
            trackEvent("scroll_milestone", {
              milestone: milestone,
              page: window.location.pathname,
            });
          }
        });
      }, 100),
    );

    // Track max scroll on page unload
    window.addEventListener("beforeunload", function () {
      trackEvent("max_scroll", {
        percentage: maxScroll,
        page: window.location.pathname,
      });
    });
  }

  /**
   * Set up click tracking
   */
  function setupClickTracking() {
    document.addEventListener("click", function (e) {
      const target = e.target.closest("a, button");
      if (!target) return;

      const trackingData = {
        element: target.tagName.toLowerCase(),
        text: target.textContent.trim().substring(0, 50),
        href: target.href || null,
        className: target.className,
        page: window.location.pathname,
      };

      // Special tracking for important elements
      if (target.classList.contains("taxfy-floating-cta")) {
        trackingData.type = "floating_cta";
      } else if (target.closest(".navbar")) {
        trackingData.type = "navigation";
      } else if (target.closest("form")) {
        trackingData.type = "form_element";
      }

      trackEvent("click", trackingData);
    });
  }

  /**
   * Set up time tracking
   */
  function setupTimeTracking() {
    const timeIntervals = [10, 30, 60, 120, 300]; // seconds
    const trackedIntervals = [];

    timeIntervals.forEach((interval) => {
      setTimeout(() => {
        if (!trackedIntervals.includes(interval)) {
          trackedIntervals.push(interval);
          trackEvent("time_on_page", {
            interval: interval,
            page: window.location.pathname,
          });
        }
      }, interval * 1000);
    });
  }

  /**
   * Track page view
   */
  function trackPageView() {
    trackEvent("page_view", {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
      },
    });
  }

  /**
   * Track event
   */
  function trackEvent(eventType, eventData) {
    if (!TaxfyCrossPlatform.settings.enable_analytics) return;

    const event = {
      type: eventType,
      data: eventData,
      timestamp: Date.now(),
      sessionId: TaxfyCrossPlatform.analytics.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    TaxfyCrossPlatform.analytics.events.push(event);

    // Send immediately for important events
    const immediateEvents = [
      "page_view",
      "session_start",
      "session_end",
      "cta_click",
    ];
    if (immediateEvents.includes(eventType)) {
      sendAnalyticsData();
    }
  }

  /**
   * Send analytics data
   */
  function sendAnalyticsData() {
    if (TaxfyCrossPlatform.analytics.events.length === 0) return;

    const data = {
      events: TaxfyCrossPlatform.analytics.events,
      sessionId: TaxfyCrossPlatform.analytics.sessionId,
      pageStartTime: TaxfyCrossPlatform.analytics.pageStartTime,
    };

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/wp-admin/admin-ajax.php",
        new URLSearchParams({
          action: "taxfy_track_events",
          data: JSON.stringify(data),
        }),
      );
    } else {
      // Fallback to regular AJAX
      $.ajax({
        url: "/wp-admin/admin-ajax.php",
        type: "POST",
        data: {
          action: "taxfy_track_events",
          data: JSON.stringify(data),
        },
        async: false, // Ensure it sends before page unload
      });
    }

    // Clear events after sending
    TaxfyCrossPlatform.analytics.events = [];
  }

  /**
   * Generate session ID
   */
  function generateSessionId() {
    return (
      "taxfy_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Export for global access
  window.TaxfyCrossPlatform = TaxfyCrossPlatform;
  window.trackEvent = trackEvent;
})(jQuery);
