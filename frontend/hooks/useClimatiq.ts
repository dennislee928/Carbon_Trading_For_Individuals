import { useState } from "react";

// Define your types/interfaces at the top
interface ClimatiqResponse {
  // Add your response type properties
  data: any;
  status: number;
}

interface EmissionParams {
  // Add your parameter types
  activity_id?: string;
  region?: string;
}

// Main hook function - everything needs to be inside this function
export function useClimatiq() {
  // State declarations
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper function definition inside the hook
  const makeGetRequest = async (url: string): Promise<ClimatiqResponse> => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add other headers as needed
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Your API methods inside the hook
  const getEmissionFactors = async (params: EmissionParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeGetRequest(
        `/api/emission-factors?${new URLSearchParams(params as any)}`
      );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateEmissions = async (params: EmissionParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeGetRequest(
        `/api/calculate-emissions?${new URLSearchParams(params as any)}`
      );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Return statement must be inside the hook function
  return {
    loading,
    error,
    getEmissionFactors,
    calculateEmissions,
  };
}
