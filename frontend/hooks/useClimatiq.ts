// hooks/useClimatiq.ts
import { useState } from "react";
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

  // Base function for making GET requests
  async function makeGetRequest(endpoint: string, params: any) {
    const queryString = new URLSearchParams();

    // Convert all params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryString.append(key, value.toString());
      }
    });

    const response = await fetch(
      `https://api.climatiq.io/${endpoint}?${queryString.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer YOUR_API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Parameters Hook (Main function)
  async function getEmissionFactors(params: ParametersModel) {
    try {
      setLoading(true);
      setError(null);
      return await makeGetRequest("emission-factors", params);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to get emission factors")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Selector Hook (Alternative function)
  async function searchEmissionFactors(params: SelectorModel) {
    try {
      setLoading(true);
      setError(null);
      return await makeGetRequest("search", params);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to search emission factors")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Estimation Hook (Alternative function)
  async function calculateEmissions(params: EstimationModel) {
    try {
      setLoading(true);
      setError(null);
      return await makeGetRequest("estimates", params);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to calculate emissions")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getEmissionFactors, // Main function listed first
    searchEmissionFactors,
    calculateEmissions,
  };
}
