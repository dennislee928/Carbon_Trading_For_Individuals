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
  query?: string;
  category?: string;
  source?: string;
  region?: string;
  year?: number;
  calculation_method?: "ar4" | "ar5" | "ar6";
  page?: number;
  results_per_page?: number;
  data_version?: string; // Add this field
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  source: string;
  region: string;
  year: number;
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
  const searchParams = {
    ...params,
    data_version: "^19", // Always include this default value
  };

  const response = await api.get("/data/v1/search", { params: searchParams });
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
