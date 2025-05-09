// app/page.tsx
/* eslint-disable */
import EmissionFactorsSearch from "../../components/EmissionFactorsSearch";
import UnitTypesDisplay from "../../components/UnitTypesDisplay";
import DataVersionsDisplay from "../../components/DataVersionsDisplay";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Carbon Rights Estimating/Calculation Platform(Dataversion must be
          choosen)
        </h1>
        {/* Emission Factors Search Section! */}
        <section className="mb-12">
          <EmissionFactorsSearch />
        </section>
        {/* Data Versions Section */}
        <section className="mb-12">
          <DataVersionsDisplay />
        </section>

        {/* Unit Types Section */}
        <section className="mb-12">
          <UnitTypesDisplay />
        </section>
      </div>
    </main>
  );
}
