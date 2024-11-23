"use client";

import { useState } from "react";
import { Loader2 as LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useClimatiq } from "@/hooks/useClimatiq";
import {
  SearchParams,
  EmissionSelector,
  EmissionParameters,
  EmissionEstimation,
} from "@/types/climatiq";

export default function DashboardPage() {
  // State management
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "",
    activity_id: "",
  });
  const [emissionParams, setEmissionParams] = useState<EmissionParameters>({
    area: {
      value: 0,
      unit: "m2",
    },
    money: {
      value: 0,
      unit: "USD",
    },
  });
  const [result, setResult] = useState<EmissionEstimation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { getEmissionFactors, calculateEmissions } = useClimatiq();

  // Handlers
  const handleSearchParamsChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setResult(null);
  };

  const handleEmissionParamsChange = (
    category: keyof EmissionParameters,
    field: "value" | "unit",
    value: string | number
  ) => {
    setEmissionParams((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get emission factors
      const selector: EmissionSelector = {
        data_version: searchParams.data_version,
        activity_id: searchParams.activity_id,
        region: searchParams.region,
        year: searchParams.year,
      };

      const emissionFactors = await getEmissionFactors(selector);
      const result = await calculateEmissions(emissionParams);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // renderSearchParams  helpers

  const renderEmissionParams = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="area_value">Area</Label>
        <div className="flex gap-2">
          <input
            type="number"
            id="area_value"
            value={emissionParams.area.value}
            onChange={(e) =>
              handleEmissionParamsChange(
                "area",
                "value",
                Number(e.target.value)
              )
            }
            className="flex-1 p-2 border rounded-md"
          />
          <select
            value={emissionParams.area.unit}
            onChange={(e) =>
              handleEmissionParamsChange("area", "unit", e.target.value)
            }
            className="w-24 p-2 border rounded-md"
          >
            <option value="m2">m²</option>
            <option value="ft2">ft²</option>
          </select>
        </div>
      </div>

      {/* Add other parameter inputs as needed */}
    </div>
  );

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-4">
          <LoaderCircle className="animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 p-4 border border-red-300 rounded-md">
          {error}
        </div>
      );
    }

    if (result) {
      return (
        <div className="p-4 border rounded-md space-y-2">
          <h3 className="font-bold">Results:</h3>
          <p>
            CO2e: {result.co2e} {result.co2e_unit}
          </p>
          <p>Method: {result.co2e_calculation_method}</p>
          <p>Origin: {result.co2e_calculation_origin}</p>
          <div>
            <h4 className="font-semibold">Constituent Gases:</h4>
            <p>CO2: {result.constituent_gases.co2}</p>
            <p>CH4: {result.constituent_gases.ch4}</p>
            <p>N2O: {result.constituent_gases.n2o}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Carbon Emissions Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>
          {renderSearchParams()}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Emission Parameters</h2>
          {renderEmissionParams()}
        </section>
      </div>

      <button
        onClick={handleCalculate}
        disabled={
          loading || !searchParams.data_version || !searchParams.activity_id
        }
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "Calculating..." : "Calculate Emissions"}
      </button>

      {renderResults()}
    </div>
  );
}
