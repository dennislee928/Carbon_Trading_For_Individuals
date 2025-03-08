// src/app/page.tsx
import Link from "next/link";
import Hero from "./components/UI/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Explore Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: "Freight", href: "/pages/Freight" },
            { name: "Travel", href: "/pages/Travel" },
            { name: "Energy", href: "/pages/Energy" },
            { name: "Computing", href: "/pages/Computing" },
            { name: "Procurement", href: "/pages/Procurement" },
            { name: "Custom Mappings", href: "/pages/CustomMappings" },
            { name: "CBAM", href: "/pages/CBAM" },
            { name: "Autopilot", href: "/pages/Autopilot" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="bg-green-100 text-green-800 p-6 rounded-lg shadow hover:bg-green-200 transition text-center"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
