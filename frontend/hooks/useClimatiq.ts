// hooks/useClimatiq.ts
import { useState } from "react";
import { getEmissionFactors } from "@/services/climatiq";
import type {
  EmissionFactorParams,
  EmissionFactorResponse,
} from "@/services/climatiq/types";

export function useClimatiq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchEmissionFactors(params: EmissionFactorParams) {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmissionFactors(params);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    fetchEmissionFactors,
  };
}
