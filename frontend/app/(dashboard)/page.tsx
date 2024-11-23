"use client";
import { Button } from "@/components/ui/button";
//import { ArrowRight, CreditCard, Database, Search } from "lucide-react";
import { Terminal } from "./terminal";
import { Search } from "lucide-react";
import { useState } from "react";
import type { SearchParams, EmissionFactor } from "@/types/climatiq";
import { useClimatiq } from "@/hooks/useClimatiq";
//
export default function HomePage() {
  const { loading, error, fetchEmissionFactors } = useClimatiq();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    data_version: "",
    activity_id: "",
  });
  const [results, setResults] = useState<EmissionFactor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchParams.data_version || !searchParams.activity_id) {
      alert("Data version and Activity ID are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/search-factors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch results");
      }
      setResults(data);
    } catch (error) {
      console.error("Error fetching emission factors:", error);
      alert("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Carbon Emission
                <span className="block text-orange-500">Calculator</span>
              </h1>

              {/* Search Form */}
              <div className="mt-8 space-y-4">
                {/* Required Fields */}
                {/* Required Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="data-version"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data Version*
                    </label>
                    <input
                      id="data-version"
                      type="text"
                      value={searchParams.data_version}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          data_version: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                      required
                      aria-label="Data Version"
                      placeholder="Enter data version"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="activity-id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Activity ID*
                    </label>
                    <input
                      id="activity-id"
                      type="text"
                      value={searchParams.activity_id}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          activity_id: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                      required
                      aria-label="Activity ID"
                      placeholder="Enter activity ID"
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="source"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Source
                    </label>
                    <input
                      id="source"
                      type="text"
                      value={searchParams.source || ""}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          source: e.target.value || undefined,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                      aria-label="Source"
                      placeholder="Enter source"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Region
                    </label>
                    <input
                      id="region"
                      type="text"
                      value={searchParams.region || ""}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          region: e.target.value || undefined,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                      aria-label="Region"
                      placeholder="Enter region"
                    />
                  </div>
                </div>

                {/* Year and Calculation Method */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Year
                    </label>
                    <input
                      id="year"
                      type="number"
                      value={searchParams.year || ""}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          year: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                      aria-label="Year"
                      placeholder="Enter year"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="calculation-method"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Calculation Method
                    </label>
                    <select
                      id="calculation-method"
                      value={searchParams.calculation_method || ""}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          calculation_method: e.target.value as
                            | "ar4"
                            | "ar5"
                            | "ar6"
                            | undefined,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                      aria-label="Calculation Method"
                    >
                      <option value="">Select method</option>
                      <option value="ar4">AR4</option>
                      <option value="ar5">AR5</option>
                      <option value="ar6">AR6</option>
                    </select>
                  </div>
                </div>

                {/* Fallback Options */}
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="region-fallback"
                      checked={searchParams.region_fallback || false}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          region_fallback: e.target.checked,
                        })
                      }
                      className="mr-2"
                      aria-label="Region Fallback"
                    />
                    <span className="text-sm text-gray-700">
                      Region Fallback
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="year-fallback"
                      checked={searchParams.year_fallback || false}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          year_fallback: e.target.checked,
                        })
                      }
                      className="mr-2"
                      aria-label="Year Fallback"
                    />
                    <span className="text-sm text-gray-700">Year Fallback</span>
                  </label>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? "Searching..." : "Search"}
                  <Search className="ml-2 h-4 w-4" />
                </Button>

                {/* Results Display */}
                {results.length > 0 && (
                  <div className="mt-4 max-h-60 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow">
                      {results.map((factor) => (
                        <div
                          key={factor.id}
                          className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <h3 className="font-medium text-gray-900">
                            {factor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Activity ID: {factor.activity_id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Source: {factor.source} | Region: {factor.region} |
                            Year: {factor.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
