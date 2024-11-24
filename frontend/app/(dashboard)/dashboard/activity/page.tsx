"use client";

import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";

export default function ActivityPage() {
  //
  const {
    getEmissionFactors,
    calculateEmissions,
    getManagementData,
    getDataVersions,
    getUnitTypes,
    getIntermodalFreight,
  } = useClimatiq();

  //

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingEmissionFactors, setLoadingEmissionFactors] = useState(false);
  const [loadingEstimation, setLoadingEstimation] = useState(false);
  const [loadingDataVersions, setLoadingDataVersions] = useState(false);

  const handleFetchEmissionFactors = async () => {
    setLoadingEmissionFactors(true);
    setError(null);
    try {
      const response = await getEmissionFactors({
        activity_id: "fuel_combustion",
        source: "DEFRA",
        year: 2022,
      });
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoadingEmissionFactors(false);
    }
  };

  const handleEstimateEmissions = async () => {
    setLoadingEstimation(true);
    setError(null);
    try {
      const response = await calculateEmissions({
        emission_factor: {
          activity_id: "fuel_combustion",
          source: "DEFRA",
          year: 2022,
        },
        parameters: {
          volume: { value: 100, unit: "liter" },
        },
      });
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoadingEstimation(false);
    }
  };

  const handleFetchDataVersions = async () => {
    setLoadingDataVersions(true);
    setError(null);
    try {
      const response = await getDataVersions();
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoadingDataVersions(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Climatiq API Integration</h1>
      <div className="space-y-4">
        <button
          onClick={handleFetchEmissionFactors}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loadingEmissionFactors}
        >
          {loadingEmissionFactors ? "Fetching..." : "Fetch Emission Factors"}
        </button>
        <button
          onClick={handleEstimateEmissions}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={loadingEstimation}
        >
          {loadingEstimation ? "Estimating..." : "Estimate Emissions"}
        </button>
        <button
          onClick={handleFetchDataVersions}
          className="px-4 py-2 bg-purple-500 text-white rounded"
          disabled={loadingDataVersions}
        >
          {loadingDataVersions ? "Fetching..." : "Fetch Data Versions"}
        </button>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {data && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
