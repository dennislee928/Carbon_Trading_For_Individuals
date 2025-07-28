"use client";
import EnergyForm from "@/app/components/Calculator/EnergyForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function EnergyPage() {
  return (
    <div>
      <h1>能源計算</h1>
      <EnergyForm />
      <EmissionFactorsSearch />
    </div>
  );
}
