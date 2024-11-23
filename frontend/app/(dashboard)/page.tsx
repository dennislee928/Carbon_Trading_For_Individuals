"use client";
import { Button } from "@/components/ui/button";
import { Terminal } from "./terminal";
import { Search } from "lucide-react";

// Update the import
import * as Icons from "lucide-react";
// Update the import
//import { Spinner } from "lucide-react";
//import { Loader } from "lucide-react";

//
import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";
import { Results } from "@/components/Results";

import type {
  SelectorModel,
  ParametersModel,
  EstimationModel,
} from "@/services/climatiq/types/models";

export default function HomePage() {
  const {
    loading,
    error,
    searchEmissionFactors,
    getEmissionFactors,
    calculateEmissions,
  } = useClimatiq();

  // State for different models
  const [selectorParams, setSelectorParams] = useState<SelectorModel>({
    activity_id: "",
    source: "",
    region: "",
    year: undefined,
    lca_activity: "",
  });

  const [parametersParams, setParametersParams] = useState<ParametersModel>({
    data_version: "",
    activity_id: "",
    source: "",
    region: "",
    year: undefined,
    calculation_method: "ar5",
    region_fallback: true,
    year_fallback: true,
  });

  const [estimationParams, setEstimationParams] = useState<EstimationModel>({
    emission_factor: {
      activity_id: "",
      source: "",
      region: "",
      year: undefined,
      data_version: "",
    },
    parameters: {},
    metadata: {},
  });

  const [results, setResults] = useState<any[]>([]);
  const [activeModel, setActiveModel] = useState<
    "selector" | "parameters" | "estimation"
  >("selector");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let data;
      switch (activeModel) {
        case "selector":
          data = await searchEmissionFactors(selectorParams);
          break;
        case "parameters":
          data = await getEmissionFactors(parametersParams);
          break;
        case "estimation":
          data = await calculateEmissions(estimationParams);
          break;
      }
      setResults(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <div className="space-y-6">
                {/* Selector Model */}
                {activeModel === "selector" && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Activity ID"
                      value={selectorParams.activity_id}
                      onChange={(e) =>
                        setSelectorParams({
                          ...selectorParams,
                          activity_id: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Source"
                      value={selectorParams.source}
                      onChange={(e) =>
                        setSelectorParams({
                          ...selectorParams,
                          source: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Region"
                      value={selectorParams.region}
                      onChange={(e) =>
                        setSelectorParams({
                          ...selectorParams,
                          region: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="LCA Activity"
                      value={selectorParams.lca_activity}
                      onChange={(e) =>
                        setSelectorParams({
                          ...selectorParams,
                          lca_activity: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={selectorParams.year || ""}
                      onChange={(e) =>
                        setSelectorParams({
                          ...selectorParams,
                          year: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-4 w-4" />
                      )}
                      Search
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
