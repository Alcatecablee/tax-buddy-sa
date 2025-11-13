// Taxfy Service Worker - Enhanced PWA Experience
const CACHE_NAME = "taxfy-v2.1.0";
const STATIC_CACHE = "taxfy-static-v2.1.0";
const DYNAMIC_CACHE = "taxfy-dynamic-v2.1.0";

// Critical resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/upload",
  "/manual-entry",
  "/dashboard",
  "/offline",
  "/manifest.json",
  "/favicon.svg",
  // Core CSS and JS will be added by build process
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/tax-calculations/,
  /\/api\/user-data/,
  /\/api\/reports/,
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  console.log("📱 Taxfy Service Worker installing...");

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("💾 Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ]),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🚀 Taxfy Service Worker activating...");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => {
              console.log("🗑️ Deleting old cache:", name);
              return caches.delete(name);
            }),
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ]),
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/api/")) {
    // API requests - cache with network-first strategy
    event.respondWith(handleApiRequest(request));
  } else if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
    // Static assets - cache-first strategy
    event.respondWith(handleStaticAsset(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/)) {
    // Static files - cache-first strategy
    event.respondWith(handleStaticFile(request));
  } else {
    // HTML pages - network-first with cache fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("📶 Network failed, checking cache for:", request.url);

    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This feature requires an internet connection",
        cached: false,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log("📶 Failed to fetch static asset:", request.url);
    // Return fallback for missing static assets
    return new Response("Asset not available offline", { status: 503 });
  }
}

// Handle static files (images, JS, CSS) with cache-first strategy
async function handleStaticFile(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("📶 Failed to fetch static file:", request.url);
    return new Response("File not available offline", { status: 503 });
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);

    // Cache successful page responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("📶 Network failed for page, checking cache:", request.url);

    // Fallback to cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for uncached pages
    const offlineCache = await caches.open(STATIC_CACHE);
    const offlinePage = await offlineCache.match("/offline");

    if (offlinePage) {
      return offlinePage;
    }

    // Final fallback
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Taxfy - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center;
              padding: 50px;
              background: #0f0f0f;
              color: #fafafa;
            }
            .icon { font-size: 48px; margin-bottom: 20px; }
            h1 { color: #3b82f6; }
            button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="icon">📱</div>
          <h1>You're Offline</h1>
          <p>Taxfy is available offline! Some features may be limited without an internet connection.</p>
          <button onclick="window.location.href='/'">Go to Home</button>
          <button onclick="window.location.href='/upload'">Upload Tax Documents</button>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("🔄 Background sync triggered:", event.tag);

  if (event.tag === "tax-calculation-sync") {
    event.waitUntil(syncTaxCalculations());
  }
});

// Sync pending tax calculations when back online
async function syncTaxCalculations() {
  try {
    // Get pending calculations from IndexedDB
    const pendingCalculations = await getPendingCalculations();

    for (const calculation of pendingCalculations) {
      try {
        await fetch("/api/tax-calculations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(calculation),
        });

        // Remove from pending after successful sync
        await removePendingCalculation(calculation.id);

        // Notify user
        self.registration.showNotification("Taxfy - Sync Complete", {
          body: "Your tax calculation has been synced!",
          icon: "/favicon.svg",
          badge: "/assets/badge-icon.png",
        });
      } catch (error) {
        console.error("Failed to sync calculation:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push notifications for tax deadlines and updates
self.addEventListener("push", (event) => {
  console.log("📬 Push notification received");

  const options = {
    body: "You have important tax updates!",
    icon: "/favicon.svg",
    badge: "/assets/badge-icon.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "Open Taxfy",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data.url = data.url || options.data.url;
  }

  event.waitUntil(self.registration.showNotification("Taxfy", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  // Open the app
  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});

// Utility functions for IndexedDB operations
async function getPendingCalculations() {
  // Implement IndexedDB operations for offline storage
  return [];
}

async function removePendingCalculation(id) {
  // Implement removal from IndexedDB
  return true;
}

console.log("📱 Taxfy Service Worker loaded successfully!");
