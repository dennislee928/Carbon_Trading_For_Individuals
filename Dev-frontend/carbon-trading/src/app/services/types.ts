// src/app/services/types.ts

// Core Search Parameters
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

// Emission Factor
export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  sector?: string;
  source: string;
  source_dataset?: string;
  region: string;
  year: number;
  year_released?: number;
  unit_type?: string;
  unit?: string;
  source_lca_activity?: string;
  access_type?: string;
  data_quality_flags?: string[];
  region_name?: string;
  example_activity_id?: string;
  uncertainty?: string;
  description?: string;
  source_link?: string;
  co2e?: number; // Added for cases where co2e is included
}

// Search Response
export interface SearchResponse {
  results: EmissionFactor[];
  current_page: number;
  last_page?: number;
  total_results: number;
  total_pages?: number;
}

// Unit Type
export interface UnitType {
  unit_type?: string; // Allow both structures
  unit?: string;
  units?: string[];
  description?: string;
}

// Data Versions Response
export interface DataVersionsResponse {
  latest_release?: string;
  latest: string;
  latest_major?: number;
  latest_minor?: number;
  versions?: string[];
}

// Freight Emission Request
export interface FreightEmissionRequest {
  distance_km: number;
  weight_kg: number;
  transport_mode: string;
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

// Freight Emission Response
export interface FreightEmissionResponse {
  co2e?: number;
  co2e_unit?: string;
  distance_km?: number;
  route?: Array<{
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
  cargo?: {
    weight: number;
    weight_unit: string;
  };
}

// Classification Search Parameters
export interface ClassificationSearchParams {
  query?: string;
  category?: string;
  sector?: string;
  year?: number;
  page?: number;
  results_per_page?: number;
}

// Classification Result
export interface ClassificationResult {
  id?: string; // Unified to allow flexibility
  activity_id?: string;
  name?: string;
  activity_name?: string;
  category: string;
  sector?: string;
  source?: string;
  year?: number;
  description?: string;
}

// Procurement Data
export interface ProcurementData {
  spend: number;
  spend_unit: string;
  category: string;
  region: string;
}

// Computing Data
export interface ComputingData {
  cpu_hours: number;
  provider: "aws" | "gcp" | "azure";
  region: string;
}

// Travel Data
export interface TravelData {
  distance_km: number;
  travel_mode: string;
  passengers?: number;
}

// Energy Data
export interface EnergyData {
  energy_kwh: number;
  region: string;
  source?: string;
  energy_type?: string;
}

// Custom Mapping Data
export interface CustomMappingData {
  source_activity_id: string;
  target_activity_id: string;
  conversion_factor?: number;
}

// CBAM Data
export interface CBAMData {
  product: string;
  weight_kg: number;
  region: string;
}

// Autopilot Data
export interface AutopilotData {
  description: string;
  quantity: number;
  unit: string;
}

// Emission Result
export interface EmissionResult {
  co2e: number;
  co2e_unit: string;
  activity_id?: string;
  confidence_quality?: string;
  energy_kwh?: number;
  parameters?: Record<string, string | number>;
}

// Union type for all possible estimation data inputs
export type EstimateDataInput =
  | FreightEmissionRequest
  | TravelData
  | EnergyData
  | ComputingData
  | ProcurementData
  | CustomMappingData
  | CBAMData
  | AutopilotData;

// 創建一個聯合類型，包含所有可能的資料類型
type EmissionEstimateData =
  | FreightEmissionRequest
  | TravelData
  | EnergyData
  | ComputingData
  | CBAMData
  | AutopilotData
  | CustomMappingData
  | ProcurementData
  | Record<string, any>; // 為了兼容性，添加 Record<string, any>

// 介面定義，用於 api.ts 中的 estimateEmissions 函數
interface EstimateEmissionsData {
  data: EmissionEstimateData; // 使用聯合類型
}

// 介面定義，用於 climatiq.ts 中的 estimate 函數
interface EstimateData {
  [key: string]: any; // 根據實際情況修改
}

export interface EmissionResult {
  co2e: number;
  co2e_unit: string;
  activity_id?: string;
  parameters?: Record<string, string | number>; // 根據實際情況修改
}

export type {
  // ... existing code ...
  EstimateEmissionsData, // 匯出 EstimateEmissionsData
  EstimateData, // 匯出 EstimateData
  // ... existing code ...
};
