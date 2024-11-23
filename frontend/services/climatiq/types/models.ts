// services/climatiq/types/models.ts

// Selector Model Types

// Parameters Model Types
export interface ParametersModel {
  data_version?: string;
  activity_id: string;
  source?: string;
  region?: string;
  year?: number;
  calculation_method?: "ar4" | "ar5" | "ar6";
  region_fallback?: boolean;
  year_fallback?: boolean;
}

// Estimation Model Types
export interface EstimationModel {
  emission_factor: {
    activity_id: string;
    source?: string;
    region?: string;
    year?: number;
    data_version?: string;
  };
  parameters: {
    [key: string]: number | string;
  };
  metadata?: {
    [key: string]: any;
  };
}
//
export interface SelectorByActivityID {
  data_version: string;
  activity_id: string;
  source?: string;
  source_dataset?: string;
  region?: string;
  region_fallback?: boolean;
  year_fallback?: boolean;
  year?: number;
  source_lca_activity?: string;
  calculation_method?: "ar4" | "ar5" | "ar6";
  allowed_data_quality_flags?: string[];
}

export interface SelectorByID {
  id: string;
  calculation_method?: "ar4" | "ar5" | "ar6";
}

export type SelectorModel = SelectorByActivityID | SelectorByID;

// Response Types
export interface EmissionFactorResponse {
  activity_id: string;
  source: string;
  region: string;
  year: number;
  emission_factor: number;
  unit: string;
}

export interface EstimationResponse {
  co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  co2e_calculation_origin: string;
  emission_factor: {
    activity_id: string;
    source: string;
    year: number;
    region: string;
    // Add other relevant fields
  };
  constituent_gases?: {
    co2e_total: number;
    co2?: number;
    ch4?: number;
    n2o?: number;
  };
}

//
// types/models.ts
export interface UnitTypesResponse {
  results: Array<{
    name: string;
    description: string;
    symbol: string;
  }>;
}

export interface DataVersionsResponse {
  results: Array<{
    version: string;
    released_on: string;
    supported_until: string;
  }>;
}

export interface ManagementResponse {
  usage: {
    current_month: {
      requests: number;
      emissions_estimates: number;
    };
    // Add other relevant fields based on the API response
  };
}
