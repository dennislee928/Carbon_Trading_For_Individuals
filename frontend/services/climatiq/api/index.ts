import axios from "axios";

// Base configuration
const BASE_URL = "https://beta3.api.climatiq.io";
const API_KEY = process.env.CLIMATIQ_API_KEY;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

/** Search Emission Factors */
export const fetchEmissionFactors = async (params: {
  activity_id?: string;
  source?: string;
  region?: string;
  year?: number;
}) => {
  const response = await apiClient.get("/search", { params });
  return response.data;
};

/** Data Versions */
export const fetchDataVersions = async () => {
  const response = await apiClient.get("/data-versions");
  return response.data;
};

/** Unit Types */
export const fetchUnitTypes = async () => {
  const response = await apiClient.get("/unit-types");
  return response.data;
};

/** Estimate Emissions */
export const estimateEmissions = async (params: {
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

/** Intermodal Freight */
export const fetchIntermodalFreight = async (params: any) => {
  const response = await apiClient.post("/intermodal-freight", params);
  return response.data;
};

/** Procurement */
export const fetchProcurement = async (params: any) => {
  const response = await apiClient.post("/procurement", params);
  return response.data;
};

/** Classifications */
export const fetchClassifications = async () => {
  const response = await apiClient.get("/classifications");
  return response.data;
};

/** Computing */
export const fetchComputing = async (params: any) => {
  const response = await apiClient.post("/computing", params);
  return response.data;
};

/** Custom Mappings */
export const fetchCustomMappings = async () => {
  const response = await apiClient.get("/custom-mappings");
  return response.data;
};

/** Travel */
export const fetchTravel = async (params: any) => {
  const response = await apiClient.post("/travel", params);
  return response.data;
};

/** Autopilot */
export const fetchAutopilot = async (params: any) => {
  const response = await apiClient.post("/autopilot", params);
  return response.data;
};

/** Energy */
export const fetchEnergy = async (params: any) => {
  const response = await apiClient.post("/energy", params);
  return response.data;
};

/** CBAM */
export const fetchCBAM = async (params: any) => {
  const response = await apiClient.post("/cbam", params);
  return response.data;
};

/** Management */
export const fetchManagement = async () => {
  const response = await apiClient.get("/management");
  return response.data;
};
