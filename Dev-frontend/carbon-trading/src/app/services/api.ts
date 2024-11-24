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
