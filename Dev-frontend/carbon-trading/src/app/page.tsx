// app/page.tsx
import EmissionFactorsSearch from "./components/EmissionFactorsSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Carbon Trading Platform
        </h1>

        {/* Emission Factors Search Section */}
        <section className="mb-12">
          <EmissionFactorsSearch />
        </section>

        {/* Add more search-related sections here */}
        {/* For example:
        <section className="mb-12">
          <OtherSearchComponent />
        </section>
        */}
      </div>
    </main>
  );
}
