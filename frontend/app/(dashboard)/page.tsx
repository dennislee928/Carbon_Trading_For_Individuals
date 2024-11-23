"use client";

import { useState } from "react";
//import { Loader2 as LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useClimatiq } from "@/hooks/useClimatiq";
import {
  SearchParams,
  EmissionSelector,
  EmissionParameters,
  EmissionEstimation,
  EmissionParams,
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

      // Transform parameters for API
      const apiParams: EmissionParams = {
        data_version: searchParams.data_version,
        activity_id: searchParams.activity_id,
        parameters: {
          area: emissionParams.area,
          money: emissionParams.money,
        },
      };

      // First get emission factors
      const selector: EmissionSelector = {
        data_version: searchParams.data_version,
        activity_id: searchParams.activity_id,
        region: searchParams.region,
        year: searchParams.year,
      };

      const emissionFactors = await getEmissionFactors(selector);
      const response = await calculateEmissions(apiParams);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'string' 
          ? err 
          : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  // renderSearchParams  helpers

  const renderEmissionParams = () => (
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6" id="page-title">
          Carbon Emissions Calculator
        </h1>
    
        <form 
          role="form" 
          aria-labelledby="page-title"
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section aria-labelledby="search-params-title">
              <h2 id="search-params-title" className="text-xl font-semibold mb-4">
                Search Parameters
              </h2>
              <div className="space-y-4">
                {/* Area Input Group */}
                <div className="form-group">
                  <Label htmlFor="area_value" className="block mb-2">
                    Area
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="area_value"
                      name="area_value"
                      value={emissionParams.area.value}
                      onChange={(e) => handleEmissionParamsChange("area", "value", Number(e.target.value))}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Enter area value"
                      aria-label="Area value"
                      min="0"
                      step="0.01"
                      required
                    />
                    <select
                      id="area_unit"
                      name="area_unit"
                      value={emissionParams.area.unit}
                      onChange={(e) => handleEmissionParamsChange("area", "unit", e.target.value)}
                      className="w-24 p-2 border rounded-md"
                      aria-label="Area unit"
                      title="Select area unit"
                    >
                      <option value="m2">m²</option>
                      <option value="ft2">ft²</option>
                    </select>
                  </div>
                </div>
    
                {/* Money Input Group */}
                <div className="form-group">
                  <Label htmlFor="money_value" className="block mb-2">
                    Money
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="money_value"
                      name="money_value"
                      value={emissionParams.money.value}
                      onChange={(e) => handleEmissionParamsChange("money", "value", Number(e.target.value))}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Enter amount"
                      aria-label="Money value"
                      min="0"
                      step="0.01"
                    />
                    <select
                      id="money_unit"
                      name="money_unit"
                      value={emissionParams.money.unit}
                      onChange={(e) => handleEmissionParamsChange("money", "unit", e.target.value)}
                      className="w-24 p-2 border rounded-md"
                      aria-label="Currency unit"
                      title="Select currency"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
    
            <section aria-labelledby="results-title">
              <h2 id="results-title" className="text-xl font-semibold mb-4">
                Results
              </h2>
              {/* Results content */}
            </section>
          </div>
    
          <button
            type="submit"
            disabled={loading || !searchParams.data_version || !searchParams.activity_id}
            className="w-full mt-6 py-2 px-4 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Emissions'}
          </button>
        </form>
    
        {error && (
          <div 
            role="alert" 
            className="mt-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md"
          >
            {error}
          </div>
        )}
      </div>
    )}}