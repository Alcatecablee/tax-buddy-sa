import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./routes";
import { SupabaseStorage, MemStorage } from "./storage";
import economicRoutes from "./routes/economic";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let storage;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    try {
      storage = new SupabaseStorage();
      log("Using SupabaseStorage for data persistence");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Failed to initialize SupabaseStorage: ${errorMessage}`);
      log("Falling back to MemStorage - data will not persist between restarts");
      storage = new MemStorage();
    }
  } else {
    log("Supabase credentials not configured, using MemStorage");
    log("Warning: Data will not persist between restarts");
    storage = new MemStorage();
  }

  registerRoutes(app, storage);
  
  // Initialize municipal storage for property tax rate management
  const { initializeMunicipalStorage } = await import('./services/municipal-data');
  initializeMunicipalStorage(storage);
  
  // Register economic data routes
  app.use('/api/economic', economicRoutes);
  
  // Register municipal/property tax routes (Phase 2)
  const municipalRoutes = await import('./routes/municipal');
  municipalRoutes.setMunicipalStorage(storage);
  app.use('/api/municipal', municipalRoutes.default);

  await setupVite(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  const PORT = 5000;
  app.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();
