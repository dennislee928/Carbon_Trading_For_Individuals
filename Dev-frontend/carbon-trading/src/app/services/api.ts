// app/services/api.ts
import axios from "axios";

const CLIMATIQ_API_KEY = process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY;

if (!CLIMATIQ_API_KEY) {
  console.error("CLIMATIQ_API_KEY is not set in environment variables");
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.climatiq.io",
  headers: {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export interface SearchParams {
  data_version: string; // Making this required as per the API spec
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

// API endpoints
export const searchEmissionFactors = async (
  params: SearchParams
): Promise<SearchResponse> => {
  // Transform allowed_data_quality_flags array to comma-separated string if present
  const searchParams = {
    ...params,
    data_version: params.data_version || "^19", // Use provided data_version or default to "^19"
    allowed_data_quality_flags: params.allowed_data_quality_flags?.join(","),
  };

  const response = await api.get("/data/v1/search", {
    params: searchParams,
    paramsSerializer: (params) => {
      return (
        Object.entries(params)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => value !== undefined) // Remove undefined values
          .map(([key, value]) => {
            // Encode the value properly, replacing spaces with +
            const encodedValue = encodeURIComponent(value.toString()).replace(
              /%20/g,
              "+"
            );
            return `${key}=${encodedValue}`;
          })
          .join("&")
      );
    },
  });

  return response.data;
};

export const getUnitTypes = async (): Promise<UnitType[]> => {
  const response = await api.get("/data/v1/unit-types");
  return response.data.unit_types;
};

export const getDataVersions = async (): Promise<DataVersionsResponse> => {
  const response = await api.get("/data/v1/data-versions");
  return response.data;
};

//
export interface FreightEmissionRequest {
  route: {
    location?:
      | { query: string }
      | { iata?: string }
      | { locode?: string }
      | { longitude: number; latitude: number };
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
  }[];
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
  route: any[];
}

export const calculateFreightEmissions = async (
  payload: FreightEmissionRequest
): Promise<FreightEmissionResponse> => {
  try {
    const response = await api.post("/freight/v2/intermodal", payload);
    return response.data;
  } catch (error) {
    console.error("Error calculating freight emissions:", error);
    throw error;
  }
};
