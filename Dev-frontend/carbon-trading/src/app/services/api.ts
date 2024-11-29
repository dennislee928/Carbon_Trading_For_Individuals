// src/app/services/api.ts

import axios, { AxiosError } from "axios";
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
    console.error(`Environment variable ${key} is not set.`);
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Validate CLIMATIQ API Key
const CLIMATIQ_API_KEY = validateEnv("NEXT_PUBLIC_CLIMATIQ_API_KEY");

// Centralized error handler
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`API Error: ${errorMessage}`);
  }
  throw new Error("An unexpected error occurred.");
};

// Axios instance configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
);

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
  }
  

  /**
   * Calculate emissions for procurement data
   */
  async calculateProcurementEmissions(data: ProcurementData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.PROCUREMENT, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Procurement emissions calculation failed."); // Ensure no undefined return
    }
  }
  

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
    }
  }

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
      handleError(error);
    }
  },
  /**
 * Calculate emissions for procurement data
 */
async calculateProcurementEmissions(data: ProcurementData): Promise<EmissionResult> {
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
}


  /**
   * Fetch available data versions
   */
  async getDataVersions(): Promise<DataVersionsResponse> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.DATA_VERSIONS);
      return response.data;
    } catch (error) {
      handleError(error);
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
    }
  },
};

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
