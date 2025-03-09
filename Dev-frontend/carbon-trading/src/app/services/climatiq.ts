import axios from "axios";
import { climatiqConfig } from "../config/climatiq.config";
import {
  FreightEmissionRequest,
  TravelData,
  EnergyData,
  ComputingData,
} from "./types";

// 您的 API 金鑰
const CLIMATIQ_API_KEY = "NKFZH0Y8Q15KKFS84BQZ3MXC0G";

// Centralized error handler
const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status || "Unknown";
    console.error(`Climatiq API Error (${statusCode}): ${errorMessage}`);
    throw new Error(`Climatiq API Error (${statusCode}): ${errorMessage}`);
  }
  console.error("An unexpected error occurred:", error);
  throw new Error("An unexpected error occurred.");
};

// Axios instance configuration
const api = axios.create({
  baseURL: climatiqConfig.baseUrl,
  headers: {
    Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const climatiqService = {
  estimate: async (data: { [key: string]: any }) => {
    try {
      const response = await api.post("/estimate", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  freight: async (data: FreightEmissionRequest) => {
    try {
      const response = await api.post("/freight/intermodal", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  travel: async (data: TravelData) => {
    try {
      const response = await api.post("/travel", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  energy: async (data: EnergyData) => {
    try {
      const response = await api.post("/energy", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  compute: async (data: ComputingData) => {
    try {
      const response = await api.post("/computing", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  // Add other endpoints (procurement, custom-mappings, etc.) as needed
};
