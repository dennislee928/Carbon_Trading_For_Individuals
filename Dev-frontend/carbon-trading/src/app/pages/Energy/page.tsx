// src/app/pages/Travel.tsx
import ClimatiqCalculator from "@/app/components/Calculator";

export default function EnergyPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Energy Carbon Footprint</h1>
      <ClimatiqCalculator initialTab="energy" />
    </div>
  );
}
