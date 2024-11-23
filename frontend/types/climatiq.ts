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
