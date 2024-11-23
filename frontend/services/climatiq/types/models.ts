// services/climatiq/types/models.ts

// Selector Model Types
export interface SelectorModel {
  activity_id?: string;
  source?: string;
  region?: string;
  year?: number;
  lca_activity?: string;
}

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
