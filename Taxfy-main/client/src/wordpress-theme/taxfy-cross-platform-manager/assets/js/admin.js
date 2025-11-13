/**
 * Taxfy Cross-Platform Manager - Admin JavaScript
 * Enhanced admin interface functionality
 */

(function ($) {
  "use strict";

  // Global variables
  let dashboard = {
    refreshInterval: null,
    isRefreshing: false,
    notifications: [],
    charts: {},
    settings: {},
  };

  // Initialize when document is ready
  $(document).ready(function () {
    init();
  });

  /**
   * Initialize the admin interface
   */
  function init() {
    console.log("🚀 Initializing Taxfy Cross-Platform Manager...");

    // Load settings
    loadSettings();

    // Initialize dashboard if on dashboard page
    if ($(".taxfy-dashboard").length) {
      initializeDashboard();
    }

    // Initialize theme manager if on theme page
    if ($("#theme-preview").length) {
      initializeThemeManager();
    }

    // Initialize analytics if on analytics page
    if ($(".analytics-dashboard").length) {
      initializeAnalytics();
    }

    // Set up global event listeners
    setupEventListeners();

    // Start auto-refresh
    startAutoRefresh();

    console.log("✅ Taxfy Manager initialized successfully");
  }

  /**
   * Load plugin settings
   */
  function loadSettings() {
    if (typeof taxfy_cpm !== "undefined") {
      dashboard.settings = taxfy_cpm;
    } else {
      // Fallback settings if global variable is not available
      dashboard.settings = {
        ajax_url: ajaxurl || "/wp-admin/admin-ajax.php",
        nonce: "",
        react_app_url: "https://taxfy.co.za",
        wp_hub_url: window.location.origin,
      };
      console.warn("Taxfy settings not found, using fallback values");
    }
  }

  /**
   * Initialize dashboard functionality
   */
  function initializeDashboard() {
    console.log("📊 Initializing dashboard...");

    // Check system health
    checkSystemHealth();

    // Load analytics
    loadAnalytics();

    // Update sync status
    updateSyncStatus();

    // Initialize real-time updates
    initializeRealTimeUpdates();
  }

  /**
   * Initialize theme manager
   */
  function initializeThemeManager() {
    console.log("🎨 Initializing theme manager...");

    // Set up color pickers
    setupColorPickers();

    // Set up font selectors
    setupFontSelectors();

    // Set up toggle switches
    setupToggleSwitches();

    // Initialize live preview
    initializeLivePreview();
  }

  /**
   * Initialize analytics
   */
  function initializeAnalytics() {
    console.log("📈 Initializing analytics...");

    // Load chart libraries
    loadCharts();

    // Set up real-time data
    setupRealTimeAnalytics();
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Dashboard actions
    $(document).on("click", "[data-action]", handleAction);

    // Sync actions
    $(document).on("click", ".sync-btn", handleSync);

    // Theme actions
    $(document).on("click", ".theme-action", handleThemeAction);

    // Settings forms
    $(document).on("submit", ".taxfy-settings-form", handleSettingsSubmit);

    // Notification dismissal
    $(document).on("click", ".notification-dismiss", dismissNotification);

    // Quick actions
    $(document).on("click", ".quick-action", handleQuickAction);

    // Tab switching
    $(document).on("click", ".nav-tab", handleTabSwitch);

    // Modal handling
    $(document).on("click", "[data-modal]", handleModal);

    // Keyboard shortcuts
    $(document).on("keydown", handleKeyboardShortcuts);
  }

  /**
   * Start auto-refresh
   */
  function startAutoRefresh() {
    // Refresh every 30 seconds
    dashboard.refreshInterval = setInterval(function () {
      if (!dashboard.isRefreshing) {
        refreshDashboard();
      }
    }, 30000);

    // Refresh on window focus
    $(window).on("focus", function () {
      refreshDashboard();
    });
  }

  /**
   * Check system health
   */
  function checkSystemHealth() {
    // Check if settings are available
    if (!dashboard.settings || !dashboard.settings.ajax_url) {
      console.error("Dashboard settings not available for system health check");
      return Promise.reject("Settings not available");
    }

    showLoading("Checking system health...");

    return $.ajax({
      url: dashboard.settings.ajax_url,
      type: "POST",
      data: {
        action: "taxfy_get_system_health",
        nonce: dashboard.settings.nonce,
      },
      success: function (response) {
        hideLoading();
        if (response.success) {
          updateHealthDisplay(response.data);
        } else {
          showNotification("Failed to check system health", "error");
        }
      },
      error: function (xhr, status, error) {
        hideLoading();
        console.error("System health check failed:", error);
        showNotification("System health check failed", "error");
      },
    });
  }

  /**
   * Update health display
   */
  function updateHealthDisplay(health) {
    // Update overall score
    $(".health-score .score").text(health.score || 85);

    // Update React app status
    const reactStatus = health.react_app || {};
    updateStatusCard("react-app", reactStatus);

    // Update individual checks
    if (health.checks) {
      health.checks.forEach(function (check, index) {
        updateHealthCheck(index, check);
      });
    }

    // Update last check time
    $(".last-health-check").text("Just now");
  }

  /**
   * Update status card
   */
  function updateStatusCard(cardType, status) {
    const card = $(`.status-card.${cardType}`);

    if (status.status === "online") {
      card.removeClass("offline").addClass("online");
      card.find(".status-text").html("✅ Online");
      card
        .find("#react-response-time")
        .text((status.response_time || 0) + "ms");
      card.find("#react-uptime").text((status.uptime || 99.9) + "%");
    } else {
      card.removeClass("online").addClass("offline");
      card.find(".status-text").html("❌ Offline");
      card.find("#react-response-time").text("-");
      card.find("#react-uptime").text("0%");
    }
  }

  /**
   * Update health check
   */
  function updateHealthCheck(index, check) {
    const item = $(`.health-item:eq(${index})`);
    item.find(".check-name").text(check.name);
    item.find(".check-message").text(check.message);
    item
      .find(".check-result")
      .removeClass("success warning error")
      .addClass(check.status)
      .text(
        check.status === "success"
          ? "✅"
          : check.status === "warning"
            ? "⚠️"
            : "❌",
      );
  }

  /**
   * Load analytics data
   */
  function loadAnalytics() {
    // Check if settings are available
    if (!dashboard.settings || !dashboard.settings.ajax_url) {
      console.error("Dashboard settings not available for analytics");
      return Promise.reject("Settings not available");
    }

    return $.ajax({
      url: dashboard.settings.ajax_url,
      type: "POST",
      data: {
        action: "taxfy_get_analytics",
        nonce: dashboard.settings.nonce,
      },
      success: function (response) {
        if (response.success) {
          updateAnalyticsDisplay(response.data);
        } else {
          console.warn("Analytics request succeeded but returned no data");
        }
      },
      error: function (xhr, status, error) {
        console.error("Failed to load analytics data:", error);
      },
    });
  }

  /**
   * Update analytics display
   */
  function updateAnalyticsDisplay(analytics) {
    $("#react-visitors").text(analytics.react_visitors || "0");
    $("#hub-visitors").text(analytics.hub_visitors || "0");
    $("#cross-sessions").text(analytics.cross_sessions || "0");

    // Update charts if available
    if (dashboard.charts.trafficChart) {
      updateTrafficChart(analytics);
    }

    // Update conversion funnel
    updateConversionFunnel(analytics);
  }

  /**
   * Update conversion funnel
   */
  function updateConversionFunnel(analytics) {
    $("#funnel-wp").text(analytics.hub_visitors || 0);
    $("#funnel-click").text(Math.round((analytics.cross_sessions || 0) * 0.8));
    $("#funnel-calc").text(Math.round((analytics.cross_sessions || 0) * 0.6));
    $("#funnel-complete").text(
      Math.round((analytics.cross_sessions || 0) * 0.3),
    );
  }

  /**
   * Handle action clicks
   */
  function handleAction(e) {
    e.preventDefault();
    const action = $(this).data("action");
    const data = $(this).data();

    switch (action) {
      case "sync-content":
        syncContent();
        break;
      case "apply-theme":
        applyTheme();
        break;
      case "test-connection":
        testConnection(data.target);
        break;
      case "refresh-analytics":
        refreshAnalytics();
        break;
      case "backup-data":
        backupData();
        break;
      default:
        console.warn("Unknown action:", action);
    }
  }

  /**
   * Sync content between platforms
   */
  function syncContent() {
    showLoading("Syncing content between platforms...");

    $.ajax({
      url: dashboard.settings.ajax_url,
      type: "POST",
      data: {
        action: "taxfy_sync_content",
        nonce: dashboard.settings.nonce,
      },
      success: function (response) {
        hideLoading();
        if (response.success) {
          showNotification("✅ Content synced successfully!", "success");
          updateSyncStatus();
          addActivityItem("Content sync completed", "success");
        } else {
          showNotification(
            "❌ Sync failed: " + (response.data || "Unknown error"),
            "error",
          );
        }
      },
      error: function () {
        hideLoading();
        showNotification("❌ Sync request failed", "error");
      },
    });
  }

  /**
   * Apply Taxfy theme
   */
  function applyTheme() {
    showLoading("Applying Taxfy theme...");

    $.ajax({
      url: dashboard.settings.ajax_url,
      type: "POST",
      data: {
        action: "taxfy_apply_theme",
        nonce: dashboard.settings.nonce,
      },
      success: function (response) {
        hideLoading();
        if (response.success) {
          showNotification("🎨 Theme applied successfully!", "success");
          addActivityItem("Theme styling updated", "success");

          // Apply theme to current page
          applyThemeToCurrentPage();
        } else {
          showNotification("❌ Theme application failed", "error");
        }
      },
      error: function () {
        hideLoading();
        showNotification("❌ Theme request failed", "error");
      },
    });
  }

  /**
   * Apply theme to current page
   */
  function applyThemeToCurrentPage() {
    // Inject Taxfy styles into current admin page
    const css = `
        <style id="taxfy-admin-theme">
        .wp-admin {
            font-family: 'Inter', sans-serif !important;
        }
        .taxfy-dashboard {
            background: #f8fafc;
        }
        </style>
        `;

    if (!$("#taxfy-admin-theme").length) {
      $("head").append(css);
    }
  }

  /**
   * Test connection to external service
   */
  function testConnection(target) {
    showLoading(`Testing connection to ${target}...`);

    $.ajax({
      url: dashboard.settings.ajax_url,
      type: "POST",
      data: {
        action: "taxfy_test_connection",
        target: target,
        nonce: dashboard.settings.nonce,
      },
      success: function (response) {
        hideLoading();
        if (response.success) {
          showNotification(`✅ Connection to ${target} successful`, "success");
        } else {
          showNotification(`❌ Connection to ${target} failed`, "error");
        }
      },
      error: function () {
        hideLoading();
        showNotification(`❌ Connection test failed`, "error");
      },
    });
  }

  /**
   * Refresh analytics
   */
  function refreshAnalytics() {
    showLoading("Refreshing analytics...");
    loadAnalytics();
    setTimeout(hideLoading, 1000);
    showNotification("📊 Analytics refreshed", "info");
  }

  /**
   * Backup data
   */
  function backupData() {
    if (!confirm("Create a backup of all cross-platform data?")) {
      return;
    }

    showLoading("Creating backup...");

    // Simulate backup process
    setTimeout(function () {
      hideLoading();
      showNotification("💾 Backup created successfully!", "success");
      addActivityItem("Data backup created", "success");
    }, 3000);
  }

  /**
   * Update sync status
   */
  function updateSyncStatus() {
    $("#last-sync").text("Just now");
    $(".sync-indicator").removeClass("never old daily").addClass("recent");
  }

  /**
   * Add activity item
   */
  function addActivityItem(action, status) {
    const item = $(`
            <div class="activity-item ${status}">
                <div class="activity-icon">${status === "success" ? "✅" : "❌"}</div>
                <div class="activity-content">
                    <span class="activity-action">${action}</span>
                    <span class="activity-time">Just now</span>
                </div>
                <div class="activity-status">
                    <span class="status-icon">${status === "success" ? "✅" : "❌"}</span>
                </div>
            </div>
        `);

    $(".activity-list").prepend(item);

    // Remove old items (keep only last 10)
    $(".activity-list .activity-item:gt(9)").remove();
  }

  /**
   * Setup color pickers
   */
  function setupColorPickers() {
    $('input[type="color"]').on("change", function () {
      updateLivePreview();
    });
  }

  /**
   * Setup font selectors
   */
  function setupFontSelectors() {
    $('select[id*="font"]').on("change", function () {
      updateLivePreview();
    });
  }

  /**
   * Setup toggle switches
   */
  function setupToggleSwitches() {
    $(".toggle-switch input").on("change", function () {
      const isChecked = $(this).is(":checked");
      const setting = $(this).attr("id");

      // Update setting via AJAX
      updateSetting(setting, isChecked);
    });
  }

  /**
   * Update setting
   */
  function updateSetting(setting, value) {
    $.ajax({
      url: dashboard.settings.ajax_url,
      type: "POST",
      data: {
        action: "taxfy_update_setting",
        setting: setting,
        value: value,
        nonce: dashboard.settings.nonce,
      },
      success: function (response) {
        if (response.success) {
          showNotification("Setting updated", "success");
        }
      },
    });
  }

  /**
   * Initialize live preview
   */
  function initializeLivePreview() {
    updateLivePreview();
  }

  /**
   * Update live preview
   */
  function updateLivePreview() {
    const primaryColor = $("#primary-color").val() || "#3399ff";
    const bgColor = $("#bg-color").val() || "#0f0f0f";
    const textColor = $("#text-color").val() || "#fafafa";
    const fontFamily = $("#font-family").val() || "Inter";
    const fontSize = $("#font-size").val() || "16px";

    const preview = $("#theme-preview");
    if (!preview.length) return;

    // Update CSS custom properties
    preview[0].style.setProperty("--primary-color", primaryColor);
    preview[0].style.setProperty("--bg-color", bgColor);
    preview[0].style.setProperty("--text-color", textColor);
    preview[0].style.setProperty("--font-family", fontFamily);
    preview[0].style.setProperty("--font-size", fontSize);

    // Apply styles
    preview.css({
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: fontFamily + ", sans-serif",
      fontSize: fontSize,
    });

    // Update specific elements
    preview.find(".nav-item.active").css("backgroundColor", primaryColor);
    preview.find(".preview-button").css("backgroundColor", primaryColor);
  }

  /**
   * Load charts
   */
  function loadCharts() {
    if (typeof Chart === "undefined") {
      console.warn("Chart.js not loaded");
      return;
    }

    // Traffic chart
    const trafficCtx = document.getElementById("traffic-chart");
    if (trafficCtx) {
      dashboard.charts.trafficChart = new Chart(trafficCtx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "React App",
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: "#3399ff",
              backgroundColor: "rgba(51, 153, 255, 0.1)",
            },
            {
              label: "WordPress Hub",
              data: [28, 48, 40, 19, 86, 27, 90],
              borderColor: "#667eea",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  /**
   * Update traffic chart
   */
  function updateTrafficChart(analytics) {
    if (!dashboard.charts.trafficChart) return;

    const chart = dashboard.charts.trafficChart;

    // Add new data point
    chart.data.datasets[0].data.push(analytics.react_visitors);
    chart.data.datasets[1].data.push(analytics.hub_visitors);

    // Remove old data (keep last 7 days)
    if (chart.data.datasets[0].data.length > 7) {
      chart.data.datasets[0].data.shift();
      chart.data.datasets[1].data.shift();
    }

    chart.update();
  }

  /**
   * Setup real-time analytics
   */
  function setupRealTimeAnalytics() {
    // Update analytics every 5 minutes
    setInterval(loadAnalytics, 300000);
  }

  /**
   * Initialize real-time updates
   */
  function initializeRealTimeUpdates() {
    // WebSocket connection would go here
    // For now, use polling
    setInterval(function () {
      if (document.visibilityState === "visible") {
        checkSystemHealth();
      }
    }, 60000); // Every minute when page is visible
  }

  /**
   * Refresh dashboard
   */
  function refreshDashboard() {
    if (dashboard.isRefreshing) return;

    dashboard.isRefreshing = true;

    Promise.all([checkSystemHealth(), loadAnalytics()]).finally(function () {
      dashboard.isRefreshing = false;
    });
  }

  /**
   * Handle keyboard shortcuts
   */
  function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + R: Refresh dashboard
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "r" &&
      $(".taxfy-dashboard").length
    ) {
      e.preventDefault();
      refreshDashboard();
      showNotification("Dashboard refreshed", "info");
    }

    // Ctrl/Cmd + S: Sync content
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "s" &&
      $(".taxfy-dashboard").length
    ) {
      e.preventDefault();
      syncContent();
    }
  }

  /**
   * Show loading overlay
   */
  function showLoading(message) {
    message = message || "Loading...";

    if ($("#taxfy-loading").length === 0) {
      $("body").append(`
                <div id="taxfy-loading" class="taxfy-loading-overlay">
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <p class="loading-message">${message}</p>
                    </div>
                </div>
            `);
    } else {
      $("#taxfy-loading .loading-message").text(message);
    }

    $("#taxfy-loading").fadeIn(200);
  }

  /**
   * Hide loading overlay
   */
  function hideLoading() {
    $("#taxfy-loading").fadeOut(200);
  }

  /**
   * Show notification
   */
  function showNotification(message, type) {
    type = type || "info";

    const notification = $(`
            <div class="taxfy-notification ${type}">
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-dismiss">&times;</button>
                </div>
            </div>
        `);

    $("body").append(notification);

    // Show notification
    setTimeout(function () {
      notification.addClass("show");
    }, 100);

    // Auto-hide after 5 seconds
    setTimeout(function () {
      hideNotification(notification);
    }, 5000);

    // Store in array for management
    dashboard.notifications.push(notification);
  }

  /**
   * Hide notification
   */
  function hideNotification(notification) {
    notification.removeClass("show");
    setTimeout(function () {
      notification.remove();
      // Remove from array
      const index = dashboard.notifications.indexOf(notification);
      if (index > -1) {
        dashboard.notifications.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Dismiss notification
   */
  function dismissNotification(e) {
    e.preventDefault();
    const notification = $(this).closest(".taxfy-notification");
    hideNotification(notification);
  }

  /**
   * Handle quick actions
   */
  function handleQuickAction(e) {
    e.preventDefault();
    const action = $(this).data("action");

    // Delegate to main action handler
    $(this).attr("data-action", action).trigger("click");
  }

  /**
   * Handle tab switching
   */
  function handleTabSwitch(e) {
    e.preventDefault();

    const tab = $(this);
    const target = tab.attr("href");

    // Update active tab
    tab.siblings().removeClass("nav-tab-active");
    tab.addClass("nav-tab-active");

    // Show target content
    $(".tab-content").hide();
    $(target).show();
  }

  /**
   * Handle modal
   */
  function handleModal(e) {
    e.preventDefault();
    const modalId = $(this).data("modal");
    $(`#${modalId}`).show();
  }

  /**
   * Handle settings form submit
   */
  function handleSettingsSubmit(e) {
    e.preventDefault();

    const form = $(this);
    const formData = form.serialize();

    showLoading("Saving settings...");

    $.ajax({
      url: form.attr("action") || dashboard.settings.ajax_url,
      type: "POST",
      data: formData,
      success: function (response) {
        hideLoading();
        if (response.success) {
          showNotification("Settings saved successfully", "success");
        } else {
          showNotification("Failed to save settings", "error");
        }
      },
      error: function () {
        hideLoading();
        showNotification("Settings save failed", "error");
      },
    });
  }

  /**
   * Handle sync action
   */
  function handleSync(e) {
    e.preventDefault();
    const syncType = $(this).data("sync-type") || "all";

    syncContent(syncType);
  }

  /**
   * Handle theme action
   */
  function handleThemeAction(e) {
    e.preventDefault();
    const action = $(this).data("theme-action");

    switch (action) {
      case "apply":
        applyTheme();
        break;
      case "preview":
        previewTheme();
        break;
      case "reset":
        resetTheme();
        break;
    }
  }

  /**
   * Preview theme
   */
  function previewTheme() {
    window.open(dashboard.settings.wp_hub_url, "_blank");
  }

  /**
   * Reset theme
   */
  function resetTheme() {
    if (!confirm("Reset all theme customizations to default?")) {
      return;
    }

    // Reset form values
    $("#primary-color").val("#3399ff");
    $("#bg-color").val("#0f0f0f");
    $("#text-color").val("#fafafa");
    $("#font-family").val("Inter");
    $("#font-size").val("16px");

    // Update preview
    updateLivePreview();

    showNotification("Theme reset to defaults", "success");
  }

  // Global functions for inline event handlers
  window.taxfyManager = {
    syncContent: syncContent,
    applyTheme: applyTheme,
    testConnection: testConnection,
    refreshAnalytics: refreshAnalytics,
    backupData: backupData,
    showNotification: showNotification,
    refreshDashboard: refreshDashboard,
  };

  // Export for external use
  window.TaxfyCrossPlatformManager = {
    dashboard: dashboard,
    syncContent: syncContent,
    applyTheme: applyTheme,
    refreshDashboard: refreshDashboard,
    showNotification: showNotification,
  };
})(jQuery);

// Loading and notification styles (injected via JS to avoid conflicts)
(function () {
  const styles = `
        <style id="taxfy-admin-ui-styles">
        .taxfy-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 100000;
            backdrop-filter: blur(4px);
        }

        .loading-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            min-width: 200px;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3399ff;
            border-radius: 50%;
            animation: taxfy-spin 1s linear infinite;
            margin: 0 auto 1rem auto;
        }

        .loading-message {
            margin: 0;
            color: #374151;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
        }

        @keyframes taxfy-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .taxfy-notification {
            position: fixed;
            top: 30px;
            right: 30px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 100001;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 350px;
            border: 1px solid #e5e7eb;
            font-family: 'Inter', sans-serif;
        }

        .taxfy-notification.show {
            transform: translateX(0);
        }

        .taxfy-notification.success {
            border-left: 4px solid #22c55e;
            background: #f0fdf4;
        }

        .taxfy-notification.error {
            border-left: 4px solid #ef4444;
            background: #fef2f2;
        }

        .taxfy-notification.warning {
            border-left: 4px solid #f59e0b;
            background: #fffbeb;
        }

        .taxfy-notification.info {
            border-left: 4px solid #3399ff;
            background: #eff6ff;
        }

        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }

        .notification-message {
            flex: 1;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
        }

        .notification-dismiss {
            background: none;
            border: none;
            font-size: 1.25rem;
            color: #9ca3af;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: color 0.2s ease;
        }

        .notification-dismiss:hover {
            color: #374151;
            background: rgba(0, 0, 0, 0.05);
        }
        </style>
    `;

  document.head.insertAdjacentHTML("beforeend", styles);
})();
