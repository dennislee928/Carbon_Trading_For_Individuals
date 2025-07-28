"use client";
import CBAMForm from "@/app/components/Calculator/CBAMForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function CBAMPage() {
  return (
    <div>
      <h1>CBAM 計算</h1>
      <CBAMForm />
      <EmissionFactorsSearch />
    </div>
  );
}
