// hooks/useClimatiq.ts
import { useState } from "react";
import { ClimatiqAPI } from "@/services/climatiq/api";
import type {
  SelectorModel,
  ParametersModel,
  EstimationModel,
  EmissionFactorResponse,
  EstimationResponse,
} from "@/services/climatiq/types/models";

export function useClimatiq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Selector Hook
  async function searchEmissionFactors(params: SelectorModel) {
    const queryString = new URLSearchParams({
      activity_id: params.activity_id || "",
      source: params.source || "",
      region: params.region || "",
      year: params.year?.toString() || "",
      lca_activity: params.lca_activity || "",
    }).toString();

    const response = await fetch(
      `https://api.climatiq.io/search?${queryString}`,
      {
        method: "GET", // Use GET method
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Parameters Hook
  async function getEmissionFactors(params: ParametersModel) {
    try {
      setLoading(true);
      setError(null);
      return await ClimatiqAPI.getEmissionFactors(params);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to get emission factors")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Estimation Hook
  async function calculateEmissions(params: EstimationModel) {
    try {
      setLoading(true);
      setError(null);
      return await ClimatiqAPI.calculateEmissions(params);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Calculation failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    searchEmissionFactors,
    getEmissionFactors,
    calculateEmissions,
  };
}
