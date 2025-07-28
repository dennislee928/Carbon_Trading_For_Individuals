"use client";
import CustomMappingForm from "@/app/components/Calculator/CustomMappingForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function CustomMappingsPage() {
  return (
    <div>
      <h1>自訂映射計算</h1>
      <CustomMappingForm />
      <EmissionFactorsSearch />
    </div>
  );
}
