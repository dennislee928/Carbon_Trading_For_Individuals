// src/app/components/Hero.tsx
export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-400 to-green-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Offset Your Carbon Footprint
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Calculate your emissions and make a difference for Taiwan and the
          planet.
        </p>
        <a
          href="/pages/Freight"
          className="inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
