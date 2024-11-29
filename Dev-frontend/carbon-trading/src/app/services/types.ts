// src/app/services/types.ts

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

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  sector?: string; // Optional if not always present
  source: string;
  source_dataset?: string; // Optional if not always present
  region: string;
  year: number; // Required if always present
  year_released?: number; // Optional if not always present
  unit_type?: string; // Optional if not always present
  unit?: string; // Optional if not always present
  source_lca_activity?: string; // Optional if not always present
  access_type?: string; // Optional if not always present
  data_quality_flags?: string[]; // Optional if not always present
  region_name?: string; // Optional if not always present
  example_activity_id?: string; // Optional if not always present
  uncertainty?: string; // Optional if not always present
  description?: string; // Optional if not always present
  source_link?: string; // Optional if not always present
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

export interface FreightEmissionRequest {
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

export interface FreightEmissionResponse {
  co2e: number;
  hub_equipment_co2e: number;
  vehicle_operation_co2e: number;
  vehicle_energy_provision_co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  distance_km: number;
  cargo_tonnes: number;
  route: Array<{
    from: {
      query?: string;
      iata?: string;
      locode?: string;
      coordinates?: {
        longitude: number;
        latitude: number;
      };
    };
    to: {
      query?: string;
      iata?: string;
      locode?: string;
      coordinates?: {
        longitude: number;
        latitude: number;
      };
    };
    distance_km: number;
    transport_mode: "road" | "air" | "sea" | "rail";
  }>;
}
//
export interface ClassificationSearchParams {
  query?: string;
  category?: string;
  sector?: string;
  year?: number;
  page?: number;
  results_per_page?: number;
}

export interface ClassificationResult {
  activity_id: string;
  activity_name: string;
  category: string;
  sector: string;
  source: string;
  year: number;
}
//

export interface ProcurementData {
  amount: number;
  currency: string;
  category: string;
  region: string;
}

export interface ComputingData {
  cpu_hours: number;
  provider: "aws" | "gcp" | "azure";
  region: string;
}

export interface EmissionResult {
  co2e: number;
  co2e_unit: string;
  confidence_quality?: string;
  energy_kwh?: number;
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  sector?: string;
  source: string;
  source_dataset?: string;
  region: string;
  year: number;
  unit_type?: string;
  source_lca_activity?: string;
  access_type?: string;
  data_quality_flags?: string[];
}

//
export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  sector?: string;
  source: string;
  source_dataset?: string;
  region: string;
  year: number;
  unit_type?: string;
  source_lca_activity?: string;
  access_type?: string;
  data_quality_flags?: string[];
}
