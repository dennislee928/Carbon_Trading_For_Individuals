// app/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`,
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
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  source: string;
  region: string;
  year: number;
  // Add more fields as needed
}

export interface SearchResponse {
  results: EmissionFactor[];
  current_page: number;
  last_page: number;
  total_results: number;
}

export const searchEmissionFactors = async (
  params: SearchParams
): Promise<SearchResponse> => {
  const response = await api.get("/data/v1/search", { params });
  return response.data;
};

export interface UnitType {
  unit_type: string;
  units: string[];
}

export const getUnitTypes = async (): Promise<UnitType[]> => {
  const response = await api.get("/data/v1/unit-types");
  return response.data.unit_types;
};
//
// app/services/api.ts
// ... (keep existing code)

export interface DataVersionsResponse {
  latest_release: string;
  latest: string;
  latest_major: number;
  latest_minor: number;
}

export const getDataVersions = async (): Promise<DataVersionsResponse> => {
  const response = await api.get("/data/v1/data-versions");
  return response.data;
};
