// services/climatiq/api/index.ts
import {
  SelectorModel,
  ParametersModel,
  EstimationModel,
  EmissionFactorResponse,
  EstimationResponse,
} from "../types/models";
import { CLIMATIQ_API } from "../constants";

export class ClimatiqAPI {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_CLIMATIQ_API_URL;
  private static readonly API_KEY = process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY;

  private static async fetchAPI<T>(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any
  ): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  }

  // Selector API
  static async searchEmissionFactors(
    params: SelectorModel
  ): Promise<EmissionFactorResponse[]> {
    return this.fetchAPI("/search", "POST", params);
  }

  // Parameters API
  static async getEmissionFactors(
    params: ParametersModel
  ): Promise<EmissionFactorResponse> {
    return this.fetchAPI("/emission-factors", "GET", params);
  }

  // Estimation API
  static async calculateEmissions(
    params: EstimationModel
  ): Promise<EstimationResponse> {
    return this.fetchAPI("/estimate", "POST", params);
  }
}
