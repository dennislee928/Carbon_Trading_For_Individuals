// types/climatiq.ts

// Search Parameters for finding emission factors
export interface SearchParams {
  data_version: string; // required
  activity_id: string; // required
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

// Selector for choosing specific emission factors
export interface EmissionSelector {
  data_version: string; // required
  activity_id: string; // required
  source?: string;
  year?: number;
  source_dataset?: string;
  region?: string;
}

// Parameters for activity data input
export interface ActivityParameters {
  // Required parameter
  area: {
    value: number; // required
    unit: string; // e.g., "m2", "ft2"
  };
  // Optional parameters
  money?: {
    value: number;
    unit: string; // e.g., "USD", "EUR"
  };
  energy?: {
    value: number;
    unit: string; // e.g., "kWh", "MJ"
  };
  fuel?: {
    value: number;
    unit: string; // e.g., "L", "gal"
  };
  distance?: {
    value: number;
    unit: string; // e.g., "km", "mi"
  };
  weight?: {
    value: number;
    unit: string; // e.g., "kg", "t"
  };
}

// Parameters for API calls
export interface EmissionParams {
  data_version: string;
  activity_id: string;
  parameters: {
    area?: {
      value: number;
      unit: string;
    };
    money?: {
      value: number;
      unit: string;
    };
    // Add other parameter types as needed
  };
}

// Response from the API
export interface ClimatiqResponse {
  co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  co2e_calculation_origin: string;
  constituent_gases: {
    co2e_total: number;
    co2: number;
    ch4: number;
    n2o: number;
  };
  activity_data: {
    activity_value: number;
    activity_unit: string;
  };
}

// Full emission estimation result
export interface EmissionEstimation extends ClimatiqResponse {
  emission_factor: {
    id: string;
    source: string;
    year: number;
    region: string;
  };
  audit_trail: string;
}

// Component state parameters
export interface EmissionParameters {
  area: {
    value: number;
    unit: string;
  };
  money: {
    value: number;
    unit: string;
  };
}

// Add  EmissionFactor
export interface EmissionFactor {
  id: string;
  source: string;
  year: number;
  region: string;
  unit: string; // Add any relevant fields based on your API response

  activity_id: string;
}
