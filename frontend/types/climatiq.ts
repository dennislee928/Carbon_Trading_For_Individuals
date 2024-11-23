export interface SearchParams {
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

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  activity_id: string;
  source: string;
  region: string;
  year: number;
  // Add other fields as needed
}
//Core resources
export interface UnitType {
  name: string;
  description: string;
  symbol: string;
}

//
export interface DataVersion {
  version: string;
  released_on: string;
  supported_until: string;
}
//
export interface ManagementData {
  usage: {
    current_month: {
      requests: number;
      emissions_estimates: number;
    };
    // Add other relevant fields
  };
}
