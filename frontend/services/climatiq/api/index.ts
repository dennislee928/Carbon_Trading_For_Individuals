import axios from "axios";

// Climatiq API Base URL
const BASE_URL = "https://beta3.api.climatiq.io";

// Add your API key (store it securely in environment variables)
const API_KEY = process.env.CLIMATIQ_API_KEY;

// Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Fetch emission factors
export const fetchEmissionFactors = async (selectorParams: {
  activity_id?: string;
  source?: string;
  region?: string;
  year?: number;
}) => {
  const response = await apiClient.get("/search", {
    params: selectorParams,
  });
  return response.data;
};

// Calculate emissions
export const calculateEmissions = async (params: {
  emission_factor: {
    activity_id: string;
    source: string;
    region?: string;
    year?: number;
  };
  parameters: any;
}) => {
  const response = await apiClient.post("/estimate", params);
  return response.data;
};

// Fetch data versions
export const fetchDataVersions = async () => {
  const response = await apiClient.get("/data-versions");
  return response.data;
};

// Fetch unit types
export const fetchUnitTypes = async () => {
  const response = await apiClient.get("/unit-types");
  return response.data;
};
