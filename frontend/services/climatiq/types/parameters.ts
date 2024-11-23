// services/climatiq/types/parameters.ts
export interface EmissionFactorParams {
  data_version?: string;
  activity_id: string;
  source?: string;
  region?: string;
  year?: number;
  calculation_method?: "ar4" | "ar5" | "ar6";
  region_fallback?: boolean;
  year_fallback?: boolean;
}

// services/climatiq/types/responses.ts
export interface EmissionFactorResponse {
  // Define response structure
  activity_id: string;
  source: string;
  region: string;
  // ... other fields
}

// services/climatiq/constants.ts
export const CLIMATIQ_API = {
  BASE_URL: "https://beta3.api.climatiq.io",
  ENDPOINTS: {
    EMISSION_FACTORS: "/emission-factors",
    // ... other endpoints
  },
};

// services/climatiq/api/factors.ts
import { EmissionFactorParams, EmissionFactorResponse } from "../types";
import { CLIMATIQ_API } from "../constants";

export async function getEmissionFactors(
  params: EmissionFactorParams
): Promise<EmissionFactorResponse> {
  const response = await fetch(
    `${CLIMATIQ_API.BASE_URL}${CLIMATIQ_API.ENDPOINTS.EMISSION_FACTORS}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch emission factors");
  }

  return response.json();
}

// services/climatiq/index.ts
export * from "./types";
export * from "./api";
export * from "./constants";
