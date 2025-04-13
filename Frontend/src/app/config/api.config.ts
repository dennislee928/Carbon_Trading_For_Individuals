// src/app/config/api.config.ts

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://carboon-trade-backend.onrender.com",
  CARBON_BACKEND_URL: "https://carboon-trade-backend.onrender.com",
  API_KEY: process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY,
  ENDPOINTS: {
    CLASSIFICATIONS: "/classifications/search",
    SEARCH: "/search",
    UNIT_TYPES: "/unit-types",
    DATA_VERSIONS: "/data-versions",
    ESTIMATE: "/estimate",
    FREIGHT_CALCULATE: "/freight/intermodal",
    COMPUTING: "/computing",
    TRAVEL: "/travel",
    PROCUREMENT: "/procurement",
    ENERGY: "/energy",
    CUSTOM_MAPPINGS: "/custom-mappings",
    CBAM: "/cbam/embedded",
    AUTOPILOT: "/autopilot/estimate",
  },
  VERSION: "v1",
} as const;
//
export const CLIMATIQ_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.climatiq.io",
  API_KEY:
    process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY || "NKFZH0Y8Q15KKFS84BQZ3MXC0G",
};
