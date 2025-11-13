import type { Express } from "express";
import { insertTaxCalculationSchema, taxCalculationSchema } from "@shared/schema";
import type { IStorage } from "./storage";
import { ZodError } from "zod";

export function registerRoutes(app: Express, storage: IStorage) {
  app.get("/api/calculations", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const calculations = await storage.getTaxCalculations(userId);
      res.json(calculations);
    } catch (error) {
      console.error("Error fetching calculations:", error);
      const message = error instanceof Error ? error.message : "Failed to fetch calculations";
      res.status(500).json({ error: message });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "Calculation ID is required" });
      }
      
      const calculation = await storage.getTaxCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      
      res.json(calculation);
    } catch (error) {
      console.error("Error fetching calculation:", error);
      const message = error instanceof Error ? error.message : "Failed to fetch calculation";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/calculations", async (req, res) => {
    try {
      const data = insertTaxCalculationSchema.parse(req.body);
      const calculation = await storage.createTaxCalculation(data);
      res.status(201).json(calculation);
    } catch (error) {
      console.error("Error creating calculation:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Invalid calculation data",
          details: error.errors
        });
      }
      
      const message = error instanceof Error ? error.message : "Failed to create calculation";
      res.status(500).json({ error: message });
    }
  });

  app.put("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "Calculation ID is required" });
      }
      
      const data = insertTaxCalculationSchema.partial().parse(req.body);
      const calculation = await storage.updateTaxCalculation(id, data);
      res.json(calculation);
    } catch (error) {
      console.error("Error updating calculation:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Invalid calculation data",
          details: error.errors
        });
      }
      
      const message = error instanceof Error ? error.message : "Failed to update calculation";
      
      if (message.includes("not found")) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      
      res.status(500).json({ error: message });
    }
  });

  app.delete("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "Calculation ID is required" });
      }
      
      await storage.deleteTaxCalculation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting calculation:", error);
      const message = error instanceof Error ? error.message : "Failed to delete calculation";
      res.status(500).json({ error: message });
    }
  });
}
