"use client";
import { Button } from "@/components/ui/button";
import { Terminal } from "./terminal";
import { Search, Loader } from "lucide-react";

import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";
import { Results } from "@/components/results";

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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Carbon Emission
                <span className="block text-orange-500">Calculator</span>
              </h1>

              {/* Model Selector */}
              <div className="mt-8 mb-4">
                <div className="flex space-x-4">
                  {["selector", "parameters", "estimation"].map((model) => (
                    <Button
                      key={model}
                      onClick={() => setActiveModel(model as any)}
                      variant={activeModel === model ? "default" : "outline"}
                      size="default" // Add size prop
                    >
                      {model.charAt(0).toUpperCase() + model.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dynamic Form Based on Active Model */}
              <div className="mt-8 space-y-4">
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
                    {/* Add other selector fields */}
                  </div>
                )}

                {activeModel === "parameters" && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Data Version"
                      value={parametersParams.data_version}
                      onChange={(e) =>
                        setParametersParams({
                          ...parametersParams,
                          data_version: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Activity ID"
                      value={parametersParams.activity_id}
                      onChange={(e) =>
                        setParametersParams({
                          ...parametersParams,
                          activity_id: e.target.value,
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    {/* Add other parameters fields */}
                  </div>
                )}

                {activeModel === "estimation" && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Activity ID"
                      value={estimationParams.emission_factor.activity_id}
                      onChange={(e) =>
                        setEstimationParams({
                          ...estimationParams,
                          emission_factor: {
                            ...estimationParams.emission_factor,
                            activity_id: e.target.value,
                          },
                        })
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                    {/* Add other estimation fields */}
                  </div>
                )}

                {/* Search Button */}
                <Button
        onClick={handleSearch}
        disabled={isLoading}
        variant="default"  // Add variant prop
        className="w-full flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search
          </>
        )}
      </Button>
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
