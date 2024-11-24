"use client";

import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";

export default function ActivityPage() {
  const {
    fetchEmissionFactors,
    fetchDataVersions,
    estimateEmissions,
    fetchUnitTypes,
    fetchManagement,
  } = useClimatiq();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchEmissionFactors = async () => {
    setLoading(true);
    try {
      const response = await fetchEmissionFactors({
        activity_id: "fuel_combustion",
        source: "DEFRA",
        year: 2022,
      });
      setData(response);
    } catch (err) {
      setError("Failed to fetch emission factors.");
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateEmissions = async () => {
    setLoading(true);
    try {
      const response = await estimateEmissions({
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
      setError("Failed to estimate emissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDataVersions = async () => {
    setLoading(true);
    try {
      const response = await fetchDataVersions();
      setData(response);
    } catch (err) {
      setError("Failed to fetch data versions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Climatiq API Integration</h1>
      <div className="space-y-4">
        <button
          onClick={handleFetchEmissionFactors}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Emission Factors"}
        </button>
        <button
          onClick={handleEstimateEmissions}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Estimating..." : "Estimate Emissions"}
        </button>
        <button
          onClick={handleFetchDataVersions}
          className="px-4 py-2 bg-purple-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Data Versions"}
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
