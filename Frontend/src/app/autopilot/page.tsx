"use client";
import AutopilotForm from "@/app/components/Calculator/AutopilotForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function AutopilotPage() {
  return (
    <div>
      <h1>Autopilot 計算</h1>
      <AutopilotForm />
      <EmissionFactorsSearch />
    </div>
  );
}
