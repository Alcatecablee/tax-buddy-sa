import { useState, useCallback, useRef } from "react";

export interface ValidationResult {
  status: "good" | "warning" | "error";
  message: string;
  confidence: number;
  suggestions?: string[];
}

export interface UseAiValidationReturn {
  validationResults: Record<string, ValidationResult>;
  loadingFields: Set<string>;
  activeChecks: number;
  requestValidation: (
    field: string,
    value: number,
    context: Record<string, number>,
  ) => void;
  dismissValidation: (field: string) => void;
  cleanup: () => void;
}

export const useAiValidation = (enabled: boolean): UseAiValidationReturn => {
  const [validationResults, setValidationResults] = useState<
    Record<string, ValidationResult>
  >({});
  const [loadingFields, setLoadingFields] = useState(new Set<string>());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const activeRequestsRef = useRef(new Set<string>());

  const dismissValidation = useCallback((field: string) => {
    setValidationResults((prev) => {
      const newResults = { ...prev };
      delete newResults[field];
      return newResults;
    });
  }, []);

  const requestValidation = useCallback(
    async (field: string, value: number, context: Record<string, number>) => {
      if (!enabled || value < 1000) {
        return;
      }

      // Clear existing timeout for this field
      const existingTimeout = timeoutsRef.current.get(field);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Debounce validation requests
      const timeoutId = setTimeout(async () => {
        // Check if we're already at the limit of concurrent requests
        if (activeRequestsRef.current.size >= 2) {
          return;
        }

        activeRequestsRef.current.add(field);
        setLoadingFields((prev) => new Set([...prev, field]));

        try {
          // This would be replaced with actual AI service call
          // For now, return a simple validation based on field type and value
          const result = await performValidation(field, value, context);

          setValidationResults((prev) => ({
            ...prev,
            [field]: result,
          }));
        } catch (error) {
          console.error("AI validation failed:", error);
          // Don't show error to user, just fail silently
        } finally {
          activeRequestsRef.current.delete(field);
          setLoadingFields((prev) => {
            const newSet = new Set(prev);
            newSet.delete(field);
            return newSet;
          });
        }
      }, 2000);

      timeoutsRef.current.set(field, timeoutId);
    },
    [enabled],
  );

  const cleanup = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    activeRequestsRef.current.clear();
    setLoadingFields(new Set());
    setValidationResults({});
  }, []);

  const activeChecks = activeRequestsRef.current.size;

  return {
    validationResults,
    loadingFields,
    activeChecks,
    requestValidation,
    dismissValidation,
    cleanup,
  };
};

// Real AI validation service using intelligent validation
async function performValidation(
  field: string,
  value: number,
  context: Record<string, number>,
): Promise<ValidationResult> {
  try {
    const { aiValidationService } = await import(
      "@/services/aiValidationService"
    );
    const result = await aiValidationService.validateField(field, value, {
      fieldType: field,
      relatedFields: context || {},
      previousYear: undefined,
      industryBenchmarks: undefined,
    });

    return {
      status: result.isValid
        ? "good"
        : result.severity === "high"
          ? "error"
          : "warning",
      message: result.message,
      confidence: result.confidence,
      suggestions: result.suggestions,
    };
  } catch (error) {
    console.error("AI validation failed:", error);
    // Return neutral result when service is unavailable
    return {
      status: "good",
      message: "✅ Amount noted",
      confidence: 50,
    };
  }
}
