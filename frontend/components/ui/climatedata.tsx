import { useState } from "react";
import { useClimatiq } from "@/hooks/useClimatiq";

export default function ClimatiqData() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { getEmissionFactors } = useClimatiq();

  const fetchEmissionFactors = async () => {
    try {
      setLoading(true);
      const response = await getEmissionFactors({
        activity_id: "fuel_combustion",
      });
      setResult(response);
    } catch (err) {
      setError("Failed to fetch emission factors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={fetchEmissionFactors}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Emission Factors"}
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
