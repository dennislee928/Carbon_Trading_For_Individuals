// components/Results.tsx
interface ResultsProps {
  factors: EmissionFactor[];
}

export function Results({ factors }: ResultsProps) {
  if (factors.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Results</h2>
      <div className="space-y-4">
        {factors.map((factor, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-medium">{factor.activity_id}</h3>
            <p className="text-sm text-gray-600">Source: {factor.source}</p>
            <p className="text-sm text-gray-600">Region: {factor.region}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
