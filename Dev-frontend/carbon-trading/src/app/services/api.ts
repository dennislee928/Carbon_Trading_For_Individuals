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
  TravelData,
  EnergyData,
  CustomMappingData,
  CBAMData,
  AutopilotData,
} from "./types";
// Utility to validate environment variables
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set.`);
    console.log(
      "CLIMATIQ_API_KEY in runtime:",
      process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY
    );

    return ""; // Return an empty string instead of throwing
  }
  return value;
};
//

// Validate CLIMATIQ API Key
const CLIMATIQ_API_KEY = "NKFZH0Y8Q15KKFS84BQZ3MXC0G";

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
      throw new Error("Failed to fetch data versions");
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

  /**
   * Estimate emissions for generic data
   */
  async estimateEmissions(data: any): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.ESTIMATE, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Emission estimation failed.");
    }
  },

  /**
   * Calculate emissions for travel data
   */
  async calculateTravelEmissions(data: TravelData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.TRAVEL, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Travel emissions calculation failed.");
    }
  },

  /**
   * Calculate emissions for energy data
   */
  async calculateEnergyEmissions(data: EnergyData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.ENERGY, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Energy emissions calculation failed.");
    }
  },

  /**
   * Create or update custom mappings
   */
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

  /**
   * Calculate CBAM embedded emissions
   */
  async calculateCBAMEmissions(data: CBAMData): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.CBAM, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("CBAM emissions calculation failed.");
    }
  },

  /**
   * Estimate emissions using Autopilot
   */
  async estimateAutopilotEmissions(
    data: AutopilotData
  ): Promise<EmissionResult> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTOPILOT, data);
      // 檢查並處理 parameters
      const result = { ...response.data }; // 建立一個新的物件，避免修改原始資料
      if (result.parameters) {
        // 遍歷 parameters 的屬性
        for (const key in result.parameters) {
          if (result.parameters.hasOwnProperty(key)) {
            const value = result.parameters[key];
            // 檢查值的類型，並進行轉換
            if (value instanceof Date) {
              result.parameters[key] = value.toISOString(); // 將 Date 轉換為字串
            } else if (typeof value === "function") {
              delete result.parameters[key]; // 移除函數
            }
            // 可以根據需要添加更多類型的檢查和轉換
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
  TravelData,
  EnergyData,
  CustomMappingData,
  CBAMData,
  AutopilotData,
};
