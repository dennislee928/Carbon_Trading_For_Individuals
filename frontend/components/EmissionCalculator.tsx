// components/EmissionCalculator.tsx
"use client";

import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";
import type { EstimationModel } from "@/services/climatiq/types/models";

export function EmissionCalculator() {
  const { loading, error, calculateEmissions } = useClimatiq();
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = async (data: EstimationModel) => {
    try {
      const response = await calculateEmissions(data);
      setResult(response.co2e);
    } catch (err) {
      console.error("Calculation failed:", err);
    }
  };

  return (
    <div>
      {/* Your calculator UI */}
      {loading && <div>Calculating...</div>}
      {error && <div className="text-red-500">{error.message}</div>}
      {result && (
        <div>
          CO2 Emission: {result} {/* Add units */}
        </div>
      )}
    </div>
  );
}
