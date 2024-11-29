// src/app/services/api.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { API_CONFIG, CLIMATIQ_CONFIG } from "../config/api.config";
//
import {
  ClassificationSearchParams,
  ClassificationResult,
  ProcurementData,
  ComputingData,
  EmissionResult,
  SearchParams,
  SearchResponse,
  UnitType,
  DataVersionsResponse,
  FreightEmissionRequest,
  FreightEmissionResponse,
  EmissionFactor,
} from "./types";
// Utility to validate environment variables
const validateEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set.`);
    return ""; // Return an empty string instead of throwing
  }
  return value;
};

// Validate CLIMATIQ API Key
const CLIMATIQ_API_KEY = validateEnv("NEXT_PUBLIC_CLIMATIQ_API_KEY");

// Centralized error handler
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || "Unknown";
    console.error(`API Error (${statusCode}): ${errorMessage}`);
    throw new Error(`API Error (${statusCode}): ${errorMessage}`);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred.");
};

// Axios instance configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => serializeParams(params),
});

// Response interceptor for centralized error handling
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${CLIMATIQ_API_KEY}`;
  return config;
});

// Utility for parameter serialization
const serializeParams = (params: Record<string, unknown>): string =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}`
    )
    .join("&");

// API service functions
export const climatiqApi = {
  /**
   * Search classifications based on parameters
   */
  async searchClassifications(
    params: ClassificationSearchParams
  ): Promise<ClassificationResult[]> {
    const defaultParams = { results_per_page: 10 };
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.CLASSIFICATIONS, {
        params: { ...defaultParams, ...params },
      });
      return response.data.results;
    } catch (error) {
      handleError(error);
      throw new Error("Classification search failed."); // Ensure no undefined return
    }
  },

  /**
   * Search for emission factors
   */
  async searchEmissionFactors(params: SearchParams): Promise<SearchResponse> {
    try {
      const queryParams = {
        ...params,
        data_version: params.data_version || "^19",
        allowed_data_quality_flags:
          params.allowed_data_quality_flags?.join(","),
      };
      const response = await api.get(API_CONFIG.ENDPOINTS.SEARCH, {
        params: queryParams,
        paramsSerializer: serializeParams,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Search emission factors failed.");
    }
  },

  /**
   * Fetch available unit types
   */
  async getUnitTypes(): Promise<UnitType[]> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.UNIT_TYPES);
      return response.data.unit_types;
    } catch (error) {
      handleError(error); // Handles the error
      throw new Error("Failed to fetch unit types"); // Explicitly throw an error
    }
  },
  /**
   * Calculate emissions for procurement data
   */
  async calculateProcurementEmissions(
    data: ProcurementData
  ): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.PROCUREMENT, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Procurement emissions calculation failed."); // Ensure no undefined return
    }
  },

  /**
   * Calculate emissions for computing data
   */
  async calculateComputingEmissions(
    data: ComputingData
  ): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.COMPUTING, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Computing emissions calculation failed."); // Ensure no undefined return
    }
  },

  /**
   * Fetch available data versions
   */
  async getDataVersions(): Promise<DataVersionsResponse | undefined> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.DATA_VERSIONS);
      return response.data;
    } catch (error) {
      handleError(error);
      return undefined; // Explicitly return undefined
    }
  },

  /**
   * Calculate emissions for freight data
   */
  async calculateFreightEmissions(
    payload: FreightEmissionRequest
  ): Promise<FreightEmissionResponse> {
    try {
      const response = await api.post(
        API_CONFIG.ENDPOINTS.FREIGHT_CALCULATE,
        payload
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Freight emissions calculation failed.");
    }
  },
};

export default climatiqApi;
// Type Exports
export type {
  ClassificationResult,
  ClassificationSearchParams,
  ProcurementData,
  ComputingData,
  EmissionResult,
  SearchParams,
  EmissionFactor,
  SearchResponse,
  UnitType,
  DataVersionsResponse,
  FreightEmissionRequest,
  FreightEmissionResponse,
};
