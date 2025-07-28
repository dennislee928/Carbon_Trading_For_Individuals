"use client";
import TravelForm from "@/app/components/Calculator/TravelForm";
import EmissionFactorsSearch from "@/app/components/EmissionFactorsSearch";

export default function TravelPage() {
  return (
    <div>
      <h1>旅遊碳排計算</h1>
      <TravelForm />
      <EmissionFactorsSearch />
    </div>
  );
}
