// src/app/config/api.config.ts

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.climatiq.io",
  ENDPOINTS: {
    SEARCH: "/data/v1/search",
    UNIT_TYPES: "/data/v1/unit-types",
    DATA_VERSIONS: "/data/v1/data-versions",
    FREIGHT_CALCULATE: "/freight/v1/calculate",
    // New endpoints
    CLASSIFICATIONS: "/search",
    PROCUREMENT: "/procurement",
    COMPUTING: "/compute/cloud",
  },
  VERSION: "v1",
} as const;
//
export const CLIMATIQ_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY,
};
