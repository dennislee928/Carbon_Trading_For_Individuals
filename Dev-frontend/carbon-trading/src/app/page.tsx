// app/page.tsx
/* eslint-disable */
import EmissionFactorsSearch from "./components/EmissionFactorsSearch";
import UnitTypesDisplay from "./components/UnitTypesDisplay";
import DataVersionsDisplay from "./components/DataVersionsDisplay";
import Head from "next/head";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Head>
        <meta name="description" content="Your page description goes here." />
      </Head>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Carbon Rights Estimating/Calculation Platform
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
