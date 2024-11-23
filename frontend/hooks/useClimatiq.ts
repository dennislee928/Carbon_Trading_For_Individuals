// hooks/useClimatiq.ts
import { useState } from "react";
import { useEffect } from 'react';
import type {
  SelectorModel,
  ParametersModel,
  EstimationModel,
  EmissionFactorResponse,
  EstimationResponse,
} from "@/services/climatiq/types/models";
//
const CLIMATIQ_API_KEY = process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY || 'NKFZH0Y8Q15KKFS84BQZ3MXC0G';

//default fetch
export const useClimatiq = () => {
  const [data, setData] = useState<ClimatiqResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.climatiq.io/data/v1/search?data_version=6', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emission_factor: {
              data_version: "3",
              activity_id: "electricity-supply_grid-source_production_mix",
              source: "MfE",
              region: "NZ",
              year: 2020
            },
            parameters: {
              energy: 4200,
              energy_unit: "kWh"
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

//
export function useClimatiq() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function makeGetRequest(endpoint: string, params: any) {
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach(v => queryString.append(key + '[]', String(v)));
        } else {
          queryString.append(key, String(value));
        }
      }
    });

    const response = await fetch(
      `https://api.climatiq.io/${endpoint}?${queryString.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  }

  async function getEmissionFactors(params: SelectorModel) {
    try {
      setLoading(true);
      setError(null);
      
      // Determine which endpoint to use based on params
      const endpoint = 'id' in params ? 'emission-factors/id' : 'emission-factors';
      
      return await makeGetRequest(endpoint, params);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to get emission factors")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getEmissionFactors,
  };
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
