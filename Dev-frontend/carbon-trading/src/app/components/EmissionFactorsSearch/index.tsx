// app/components/EmissionFactorsSearch/index.tsx
"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  searchEmissionFactors,
  type EmissionFactor,
  type SearchParams,
} from "@/app/services/api";

export default function EmissionFactorsSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EmissionFactor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchParams>({
    query: "",
    page: 1,
    results_per_page: 20,
  });

  const [debouncedQuery] = useDebounce(filters.query, 500);
  // Add effect to trigger search when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      handleSearch();
    }
  }, [debouncedQuery]);
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const response = await searchEmissionFactors({
        ...filters,
        query: debouncedQuery, // Use the debounced query value
      });
      setResults(response.results);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Emission Factors Search
        </h2>

        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <input
              type="text"
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search emission factors..."
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="electricity">Electricity</option>
                <option value="transport">Transport</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <input
                type="text"
                value={filters.region || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, region: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter region..."
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                value={filters.year || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    year: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter year..."
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Results</h3>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((factor) => (
              <div
                key={factor.id}
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
              >
                <h4 className="font-medium">{factor.name}</h4>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Category: {factor.category}</p>
                  <p>Region: {factor.region}</p>
                  <p>Year: {factor.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No results found</div>
        )}

        {/* Pagination */}
        {results.length > 0 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(1, (prev.page || 1) - 1),
                }))
              }
              disabled={filters.page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {filters.page} of {totalPages}
            </span>
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
              }
              disabled={filters.page === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
