// src/app/services/api.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import axios, { AxiosError } from "axios"; // 移除 AxiosError
import axios from "axios"; // 僅匯入 axios
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import {  CLIMATIQ_CONFIG } from "../config/api.config";
import { API_CONFIG, CLIMATIQ_CONFIG } from "../config/api.config.js";
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
  TravelData,
  EnergyData,
  CustomMappingData,
  CBAMData,
  AutopilotData,
  EstimateDataInput, // Import the new union type
} from "./types";
//

// Dev-frontend/carbon-trading/src/app/services/api.ts
const BASE_URL = CLIMATIQ_CONFIG.BASE_URL || "https://api.climatiq.io";
// ... existing code ...
// Utility to validate environment variables
const validateEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set.`);
    return "";
  }
  return value;
};

// Validate CLIMATIQ API Key
const CLIMATIQ_API_KEY =
  CLIMATIQ_CONFIG.API_KEY ||
  validateEnv("NEXT_PUBLIC_CLIMATIQ_API_KEY", "NKFZH0Y8Q15KKFS84BQZ3MXC0G");

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
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => serializeParams(params),
});

// Request interceptor for dynamic Authorization header
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
      throw new Error("Classification search failed.");
    }
  },

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

  async getUnitTypes(): Promise<UnitType[]> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.UNIT_TYPES);
      return response.data.unit_types;
    } catch (error) {
      handleError(error);
      throw new Error("Failed to fetch unit types");
    }
  },

  async calculateProcurementEmissions(
    data: ProcurementData
  ): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.PROCUREMENT, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Procurement emissions calculation failed.");
    }
  },

  async calculateComputingEmissions(
    data: ComputingData
  ): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.COMPUTING, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Computing emissions calculation failed.");
    }
  },

  async getDataVersions(): Promise<DataVersionsResponse> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.DATA_VERSIONS);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Failed to fetch data versions");
    }
  },

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

  async estimateEmissions(data: EstimateDataInput): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.ESTIMATE, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Emission estimation failed.");
    }
  },

  async calculateTravelEmissions(data: TravelData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.TRAVEL, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Travel emissions calculation failed.");
    }
  },

  async calculateEnergyEmissions(data: EnergyData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.ENERGY, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Energy emissions calculation failed.");
    }
  },

  async createCustomMapping(data: CustomMappingData): Promise<EmissionResult> {
    try {
      const response = await api.post(
        API_CONFIG.ENDPOINTS.CUSTOM_MAPPINGS,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Custom mapping creation failed.");
    }
  },

  async calculateCBAMEmissions(data: CBAMData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.CBAM, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("CBAM emissions calculation failed.");
    }
  },

  async estimateAutopilotEmissions(
    data: AutopilotData
  ): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTOPILOT, data);
      const result = { ...response.data };
      if (result.parameters) {
        for (const key in result.parameters) {
          if (result.parameters.hasOwnProperty(key)) {
            const value = result.parameters[key];
            if (value instanceof Date) {
              result.parameters[key] = value.toISOString();
            } else if (typeof value === "function") {
              delete result.parameters[key];
            }
          }
        }
      }
      return result;
    } catch (error) {
      handleError(error);
      throw new Error("Autopilot emissions estimation failed.");
    }
  },
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

export default climatiqApi;

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
  TravelData,
  EnergyData,
  CustomMappingData,
  CBAMData,
  AutopilotData,
  EstimateDataInput,
};
