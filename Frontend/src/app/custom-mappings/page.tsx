"use client";
import { useState } from "react";
import CustomMappingForm from "@/app/components/Calculator/CustomMappingForm";
import Results from "@/app/components/Calculator/Results";
import { EmissionResult } from "../services/types";

export default function CustomMappingsPage() {
  const [results, setResults] = useState<EmissionResult | null>(null);

  const handleResult = (data: EmissionResult) => {
    setResults(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          自訂映射計算器
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CustomMappingForm onResult={handleResult} />
          {results && <Results data={results} />}
        </div>
      </div>
    </div>
  );
}
