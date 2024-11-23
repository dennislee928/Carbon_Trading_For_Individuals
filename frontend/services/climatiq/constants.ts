// services/climatiq/constants.ts
export const CLIMATIQ_API = {
  ENDPOINTS: {
    SEARCH: "/search",
    EMISSION_FACTORS: "/emission-factors",
    ESTIMATE: "/estimate",
  },
  CALCULATION_METHODS: {
    AR4: "ar4",
    AR5: "ar5",
    AR6: "ar6",
  } as const,
};
