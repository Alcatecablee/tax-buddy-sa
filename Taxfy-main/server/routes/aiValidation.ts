import { Router } from "express";
import { aiValidationService } from "../services/aiValidationService.js";

const router = Router();

// AI Validation endpoint
router.post("/ai-validation", async (req, res) => {
  try {
    const { field, value, context } = req.body;

    if (!field || value === undefined) {
      return res.status(400).json({
        error: "Missing required fields: field and value",
      });
    }

    const result = await aiValidationService.validateField(field, value, {
      fieldType: field,
      relatedFields: context?.relatedFields || {},
      previousYear: context?.previousYear,
      industryBenchmarks: context?.industryBenchmarks,
    });

    res.json({
      isValid: result.isValid,
      confidence: result.confidence,
      message: result.message,
      suggestions: result.suggestions,
      anomalies: result.anomalies,
      severity: result.severity,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI validation error:", error);
    res.status(500).json({
      error: "AI validation service error",
      message: "Unable to validate field at this time",
    });
  }
});

// Batch validation endpoint
router.post("/ai-validation/batch", async (req, res) => {
  try {
    const { fields, context } = req.body;

    if (!fields || typeof fields !== "object") {
      return res.status(400).json({
        error: "Missing or invalid fields object",
      });
    }

    const results = await aiValidationService.validateMultipleFields(fields, {
      fieldType: "batch",
      relatedFields: fields,
      previousYear: context?.previousYear,
      industryBenchmarks: context?.industryBenchmarks,
    });

    res.json({
      results,
      timestamp: new Date().toISOString(),
      processedFields: Object.keys(fields).length,
    });
  } catch (error) {
    console.error("Batch AI validation error:", error);
    res.status(500).json({
      error: "Batch validation service error",
      message: "Unable to validate fields at this time",
    });
  }
});

// Health check endpoint
router.get("/ai-validation/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "AI Validation Service",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    features: [
      "Field validation",
      "Anomaly detection",
      "South African tax compliance",
      "Intelligent fallback validation",
    ],
  });
});

export default router;
