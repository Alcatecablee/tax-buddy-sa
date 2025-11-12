import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Express } from "express";
import type { ViteDevServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} ${message}`);
}

export async function setupVite(app: Express, server: any) {
  const isProduction = process.env.NODE_ENV === "production";
  const clientPath = path.resolve(__dirname, "../client");

  if (isProduction) {
    app.use(express.static(path.join(clientPath, "dist"), { index: false }));
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: "custom",
      root: clientPath,
    });

    app.use(vite.middlewares);
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;
      let render: any;

      if (!isProduction) {
        const viteModule = await import("vite");
        const vite = res.locals.vite as ViteDevServer | undefined;
        if (!vite) {
          return next();
        }

        template = fs.readFileSync(
          path.join(clientPath, "index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(
          path.join(clientPath, "dist", "index.html"),
          "utf-8",
        );
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e: any) {
      if (!isProduction) {
        const vite = res.locals.vite as ViteDevServer | undefined;
        if (vite) {
          vite.ssrFixStacktrace(e);
        }
      }
      next(e);
    }
  });

  return server;
}

export function serveStatic(app: Express) {
  const clientPath = path.resolve(__dirname, "../client");
  app.use(express.static(path.join(clientPath, "dist")));
}
