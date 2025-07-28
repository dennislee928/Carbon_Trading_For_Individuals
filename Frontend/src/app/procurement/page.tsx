"use client";
import ProcurementForm from "@/app/components/Calculator/ProcurementForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function ProcurementPage() {
  return (
    <div>
      <h1>採購計算</h1>
      <ProcurementForm />
      <EmissionFactorsSearch />
    </div>
  );
}
