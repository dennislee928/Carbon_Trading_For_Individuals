"use client";
import { Button } from "@/components/ui/button";
import { Terminal } from "./terminal";
import { Search } from "lucide-react";

import { ClimatiqData } from "@/components/ui/ClimatiqData";
// Update the import
import * as Icons from "lucide-react";

import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";
import { Results } from "@/components/Results";

import type {
  SelectorModel,
  ParametersModel,
  EstimationModel,
} from "@/services/climatiq/types/models";

export default function HomePage() {
  const { loading, error, getEmissionFactors } = useClimatiq();
  const [searchType, setSearchType] = useState<"activity" | "id">("activity");
  const [params, setParams] = useState<SelectorModel>({
    data_version: "",
    activity_id: "",
    source: "",
    region: "",
    year: undefined,
    calculation_method: "ar5",
    region_fallback: true,
    year_fallback: true,
  });

  const handleSearch = async () => {
    if (
      searchType === "activity" &&
      !("activity_id" in params || !params.data_version)
    ) {
      alert("Activity ID and Data Version are required for activity search");
      return;
    }
    if (searchType === "id" && !("id" in params)) {
      alert("Emission Factor ID is required for ID search");
      return;
    }

    try {
      const result = await getEmissionFactors(params);
      // Handle result
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h1>Climate Impact Dashboard</h1>
        <ClimatiqData />
        <label className="block mb-2">Search Type</label>
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value as "activity" | "id");
            // Reset params based on search type
            if (e.target.value === "id") {
              setParams({ id: "", calculation_method: "ar5" });
            } else {
              setParams({
                data_version: "",
                activity_id: "",
                source: "",
                calculation_method: "ar5",
              });
            }
          }}
          className="w-full p-2 border rounded-md"
        >
          <option value="activity">Search by Activity ID</option>
          <option value="id">Search by Emission Factor ID</option>
        </select>
      </div>

      {searchType === "activity" ? (
        // Activity ID search form
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Activity ID *"
            value={"activity_id" in params ? params.activity_id : ""}
            onChange={(e) =>
              setParams((prev) => ({
                ...(prev as SelectorByActivityID),
                activity_id: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Data Version *"
            value={"data_version" in params ? params.data_version : ""}
            onChange={(e) =>
              setParams((prev) => ({
                ...(prev as SelectorByActivityID),
                data_version: e.target.value,
              }))
            }
            className="w-full p-2 border rounded-md"
            required
          />
          {/* Add other optional fields */}
        </div>
      ) : (
        // Emission Factor ID search form
        <input
          type="text"
          placeholder="Emission Factor ID *"
          value={"id" in params ? params.id : ""}
          onChange={(e) =>
            setParams((prev) => ({
              ...(prev as SelectorByID),
              id: e.target.value,
            }))
          }
          className="w-full p-2 border rounded-md"
          required
        />
      )}

      <Button onClick={handleSearch} disabled={loading} className="w-full mt-4">
        {loading ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Search className="mr-2 h-4 w-4" />
        )}
        Search Emission Factors
      </Button>
    </div>
  );
}
