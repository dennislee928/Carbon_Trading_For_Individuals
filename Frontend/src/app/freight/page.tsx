"use client";
import FreightForm from "@/app/components/Calculator/FreightForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function FreightPage() {
  return (
    <div>
      <h1>運輸碳排計算</h1>
      <FreightForm />
      <EmissionFactorsSearch />
    </div>
  );
}
