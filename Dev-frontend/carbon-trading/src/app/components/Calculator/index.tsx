"use client";
import { useState, useCallback } from "react";
import FreightForm from "./FreightForm";
import TravelForm from "./TravelForm";
import EnergyForm from "./EnergyForm";
import ComputeForm from "./ComputeForm";
import ProcurementForm from "./ProcurementForm";
import CustomMappingForm from "./CustomMappingForm";
import CBAMForm from "./CBAMForm";
import AutopilotForm from "./AutopilotForm";
import Results from "./Results";
import { EmissionResult } from "../../services/types";

export default function ClimatiqCalculator({ initialTab = "freight" }) {
  const [results, setResults] = useState<EmissionResult | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleResult = useCallback((data: EmissionResult) => {
    setResults(data);
  }, []);

  const tabs = [
    "freight",
    "travel",
    "energy",
    "compute",
    "procurement",
    "customMappings",
    "cbam",
    "autopilot",
  ];

  return (
    <div className="p-4">
      <div className="tabs mb-4 flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "freight" && <FreightForm onResult={handleResult} />}
      {activeTab === "travel" && <TravelForm onResult={handleResult} />}
      {activeTab === "energy" && <EnergyForm onResult={handleResult} />}
      {activeTab === "compute" && <ComputeForm onResult={handleResult} />}
      {activeTab === "procurement" && (
        <ProcurementForm onResult={handleResult} />
      )}
      {activeTab === "customMappings" && (
        <CustomMappingForm onResult={handleResult} />
      )}
      {activeTab === "cbam" && <CBAMForm onResult={handleResult} />}
      {activeTab === "autopilot" && <AutopilotForm onResult={handleResult} />}

      {results && <Results data={results as EmissionResult} />}
    </div>
  );
}
