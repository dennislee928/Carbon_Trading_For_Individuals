"use client";

import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";

export default function EmissionCalculator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { searchEmissionFactors, calculateEmissionsWithParams } = useClimatiq();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchEmissionFactors({
        activity_id: "fuel_combustion",
        source: "DEFRA",
        year: 2022,
      });
      setResult(response);
    } catch (err) {
      setError("Error fetching emission factors.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      const response = await calculateEmissionsWithParams({
        emission_factor: {
          activity_id: "fuel_combustion",
          source: "DEFRA",
          year: 2022,
        },
        parameters: {
          volume: { value: 100, unit: "liter" },
        },
      });
      setResult(response);
    } catch (err) {
      setError("Error calculating emissions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Emission Calculator</h1>
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search Emission Factors"}
      </button>
      <button
        onClick={handleCalculate}
        className="px-4 py-2 bg-green-500 text-white rounded ml-4"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate Emissions"}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
