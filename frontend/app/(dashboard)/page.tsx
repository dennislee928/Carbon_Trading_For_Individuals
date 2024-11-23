"use client";
import { Button } from "@/components/ui/button";
import { Terminal } from "./terminal";
import { Search, Loader2 } from "lucide-react"; // Added Loader2 for loading state
import { useState } from "react";
import type { SearchParams, EmissionFactor } from "@/types/climatiq";
import { useClimatiq } from "@/hooks/useClimatiq";
//
import { Results } from "@/components/Results";
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

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>

                {/* Results Section */}
                {results.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">Results</h2>
                    <div className="space-y-4">
                      {results.map((factor, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-white shadow-sm"
                        >
                          <h3 className="font-medium">{factor.activity_id}</h3>
                          <p className="text-sm text-gray-600">
                            Source: {factor.source}
                          </p>
                          <p className="text-sm text-gray-600">
                            Region: {factor.region}
                          </p>
                          {/* Add more factor details as needed */}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
                    {error.message}
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Section */}
            <div className="mt-12 relative lg:mt-0 lg:col-span-6">
              <Terminal />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
