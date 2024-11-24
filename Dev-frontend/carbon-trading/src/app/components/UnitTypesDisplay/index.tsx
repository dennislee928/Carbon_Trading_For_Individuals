// app/components/UnitTypesDisplay/index.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { getUnitTypes, type UnitType } from "@/app/services/api";

export default function UnitTypesDisplay() {
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Memoize fetchUnitTypes to prevent unnecessary recreations
  const fetchUnitTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getUnitTypes();
      setUnitTypes(data);
      setError(null);
    } catch (err) {
      setError("Failed to load unit types");
      console.error("Error fetching unit types:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnitTypes();
  }, [fetchUnitTypes]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              onClick={() => fetchUnitTypes()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedUnitType = unitTypes.find(
    (type) => type.unit_type === selectedType
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Unit Types
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unit Types List */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Unit Types</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {unitTypes.map((type) => (
                <button
                  key={type.unit_type}
                  onClick={() => setSelectedType(type.unit_type)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    selectedType === type.unit_type
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {type.unit_type}
                </button>
              ))}
            </div>
          </div>

          {/* Units Display */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Available Units</h3>
            {selectedType ? (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-600 mb-3">
                  {selectedType}
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {selectedUnitType?.units.map((unit) => (
                    <div
                      key={unit}
                      className="px-3 py-2 bg-gray-50 rounded-md text-sm"
                    >
                      {unit}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Select a unit type to view available units
              </div>
            )}
          </div>
        </div>

        {/* Total Count Display */}
        <div className="mt-6 text-sm text-gray-600">
          Total Unit Types: {unitTypes.length}
        </div>
      </div>
    </div>
  );
}
