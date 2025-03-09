// src/app/services/climatiq.ts
import axios from "axios";
import { climatiqConfig } from "../config/climatiq.config";
import {
  FreightEmissionRequest,
  TravelData,
  EnergyData,
  ComputingData,
  EmissionResult,
  EstimateDataInput, // Import the new union type
} from "./types";

// Your API Key
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
  estimate: async (data: EstimateDataInput): Promise<EmissionResult> => {
    try {
      const response = await api.post("/estimate", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Estimation failed."); // Ensure no undefined return
    }
  },
  freight: async (data: FreightEmissionRequest): Promise<EmissionResult> => {
    try {
      const response = await api.post("/freight/intermodal", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Freight estimation failed.");
    }
  },
  travel: async (data: TravelData): Promise<EmissionResult> => {
    try {
      const response = await api.post("/travel", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Travel estimation failed.");
    }
  },
  energy: async (data: EnergyData): Promise<EmissionResult> => {
    try {
      const response = await api.post("/energy", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Energy estimation failed.");
    }
  },
  compute: async (data: ComputingData): Promise<EmissionResult> => {
    try {
      const response = await api.post("/computing", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw new Error("Compute estimation failed.");
    }
  },
};
