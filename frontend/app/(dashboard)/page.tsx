"use client";

import { useState } from "react";

import { useClimatiq } from "@/hooks/useClimatiq";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [selectedApi, setSelectedApi] =
    useState<keyof typeof apiFunctions>("estimate");
  const [apiParams, setApiParams] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    getEmissionFactors,
    calculateEmissions,
    getManagementData,
    getDataVersions,
    getUnitTypes,
    getIntermodalFreight,
  } = useClimatiq();

  const apiFunctions = {
    search: getEmissionFactors,
    estimate: calculateEmissions,
    "data-versions": getDataVersions,
    "unit-types": getUnitTypes,
    management: getManagementData,
    "intermodal-freight": getIntermodalFreight,
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Retrieve the selected API function
      const apiFunction = apiFunctions[selectedApi];
      if (!apiFunction) throw new Error("Invalid API selected.");

      // Call the selected API function
      const response = await apiFunction(apiParams);
      setResult(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Climatiq API Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="api-selector" className="block font-medium mb-2">
          Select API Endpoint
        </label>
        <select
          id="api-selector"
          value={selectedApi}
          onChange={(e) =>
            setSelectedApi(e.target.value as keyof typeof apiFunctions)
          }
          className="w-full p-2 border rounded-md"
        >
          {Object.keys(apiFunctions).map((api) => (
            <option key={api} value={api}>
              {api}
            </option>
          ))}
        </select>
      </div>

      {/* Render dynamic inputs based on selected API */}
      <div className="space-y-4">
        {selectedApi === "estimate" && (
          <>
            <div>
              <label className="block mb-2">Activity ID</label>
              <input
                type="text"
                placeholder="Activity ID"
                value={apiParams.activity_id || ""}
                onChange={(e) =>
                  setApiParams({ ...apiParams, activity_id: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2">Volume</label>
              <input
                type="number"
                placeholder="Volume"
                value={apiParams.parameters?.volume?.value || ""}
                onChange={(e) =>
                  setApiParams({
                    ...apiParams,
                    parameters: {
                      ...apiParams.parameters,
                      volume: { value: Number(e.target.value), unit: "liter" },
                    },
                  })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
          </>
        )}

        {selectedApi === "search" && (
          <div>
            <label className="block mb-2">Activity ID</label>
            <input
              type="text"
              placeholder="Activity ID"
              value={apiParams.activity_id || ""}
              onChange={(e) =>
                setApiParams({ ...apiParams, activity_id: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        {selectedApi === "management" && (
          <p>No input needed for the management API.</p>
        )}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full mt-6 py-2 px-4 bg-blue-500 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
