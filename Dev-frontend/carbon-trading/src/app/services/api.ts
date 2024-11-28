// src/app/services/api.ts

import axios from "axios";

const CLIMATIQ_API_KEY = process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY;

if (!CLIMATIQ_API_KEY) {
  console.error("CLIMATIQ_API_KEY is not set in environment variables");
}

// API endpoints configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.climatiq.io",
  ENDPOINTS: {
    SEARCH: "/data/v1/search",
    UNIT_TYPES: "/data/v1/unit-types",
    DATA_VERSIONS: "/data/v1/data-versions",
    FREIGHT_CALCULATE: "/freight/v1/calculate",
  },
} as const;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`API Error: ${errorMessage}`);
    }
    throw error;
  }
);

export interface SearchParams {
  data_version: string;
  query?: string;
  activity_id?: string;
  id?: string;
  category?: string;
  sector?: string;
  source?: string;
  source_dataset?: string;
  year?: number;
  region?: string;
  unit_type?: string;
  source_lca_activity?: string;
  calculation_method?: "ar4" | "ar5" | "ar6";
  allowed_data_quality_flags?: string[];
  access_type?: "public" | "private" | "premium";
  page?: number;
  results_per_page?: number;
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  sector?: string;
  source: string;
  source_dataset?: string;
  region: string;
  year: number;
  unit_type?: string;
  source_lca_activity?: string;
  access_type?: string;
  data_quality_flags?: string[];
}

export interface SearchResponse {
  results: EmissionFactor[];
  current_page: number;
  last_page: number;
  total_results: number;
}

export interface UnitType {
  unit_type: string;
  units: string[];
}

export interface DataVersionsResponse {
  latest_release: string;
  latest: string;
  latest_major: number;
  latest_minor: number;
}

export const searchEmissionFactors = async (
  params: SearchParams
): Promise<SearchResponse> => {
  try {
    const searchParams = {
      ...params,
      data_version: params.data_version || "^19",
      allowed_data_quality_flags: params.allowed_data_quality_flags?.join(","),
    };

    const response = await api.get(API_CONFIG.ENDPOINTS.SEARCH, {
      params: searchParams,
      paramsSerializer: (params) => {
        return Object.entries(params)
          .filter(([, value]) => value !== undefined) // Use comma without variable name
          .map(([key, value]) => {
            const encodedValue = encodeURIComponent(value.toString()).replace(
              /%20/g,
              "+"
            );
            return `${key}=${encodedValue}`;
          })
          .join("&");
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`Search failed: ${errorMessage}`);
    }
    throw new Error("An unexpected error occurred during search");
  }
};

export const getUnitTypes = async (): Promise<UnitType[]> => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.UNIT_TYPES);
    return response.data.unit_types;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`Failed to fetch unit types: ${errorMessage}`);
    }
    throw new Error("An unexpected error occurred while fetching unit types");
  }
};

export const getDataVersions = async (): Promise<DataVersionsResponse> => {
  try {
    const response = await api.get(API_CONFIG.ENDPOINTS.DATA_VERSIONS);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`Failed to fetch data versions: ${errorMessage}`);
    }
    throw new Error(
      "An unexpected error occurred while fetching data versions"
    );
  }
};

export interface FreightEmissionRequest {
  route: Array<{
    location?: {
      query?: string;
      iata?: string;
      locode?: string;
      coordinates?: {
        longitude: number;
        latitude: number;
      };
    };
    transport_mode?: "road" | "air" | "sea" | "rail";
    leg_details?: {
      rest_of_world?: {
        vehicle_type: string;
        vehicle_weight: string;
        fuel_source: string;
      };
      north_america?: {
        vehicle_type: string;
      };
    };
  }>;
  cargo: {
    weight: number;
    weight_unit: string;
  };
}

export interface FreightEmissionResponse {
  co2e: number;
  hub_equipment_co2e: number;
  vehicle_operation_co2e: number;
  vehicle_energy_provision_co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  distance_km: number;
  cargo_tonnes: number;
  route: Array<{
    from: {
      query?: string;
      iata?: string;
      locode?: string;
      coordinates?: {
        longitude: number;
        latitude: number;
      };
    };
    to: {
      query?: string;
      iata?: string;
      locode?: string;
      coordinates?: {
        longitude: number;
        latitude: number;
      };
    };
    distance_km: number;
    transport_mode: "road" | "air" | "sea" | "rail";
  }>;
}

export const calculateFreightEmissions = async (
  payload: FreightEmissionRequest
): Promise<FreightEmissionResponse> => {
  try {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.FREIGHT_CALCULATE,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`Freight emission calculation failed: ${errorMessage}`);
    }
    throw new Error(
      "An unexpected error occurred during freight emission calculation"
    );
  }
};
