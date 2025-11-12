import type { Express } from "express";
import { insertTaxCalculationSchema, taxCalculationSchema } from "@shared/schema";
import type { IStorage } from "./storage";

export function registerRoutes(app: Express, storage: IStorage) {
  app.get("/api/calculations", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const calculations = await storage.getTaxCalculations(userId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const calculation = await storage.getTaxCalculation(req.params.id);
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculation" });
    }
  });

  app.post("/api/calculations", async (req, res) => {
    try {
      const data = insertTaxCalculationSchema.parse(req.body);
      const calculation = await storage.createTaxCalculation(data);
      res.status(201).json(calculation);
    } catch (error) {
      res.status(400).json({ error: "Invalid calculation data" });
    }
  });

  app.put("/api/calculations/:id", async (req, res) => {
    try {
      const data = insertTaxCalculationSchema.partial().parse(req.body);
      const calculation = await storage.updateTaxCalculation(req.params.id, data);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ error: "Invalid calculation data" });
    }
  });

  app.delete("/api/calculations/:id", async (req, res) => {
    try {
      await storage.deleteTaxCalculation(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete calculation" });
    }
  });
}
