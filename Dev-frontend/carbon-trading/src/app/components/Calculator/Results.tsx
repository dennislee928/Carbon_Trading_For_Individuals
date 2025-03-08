// ... existing code ...
export default function Results({ data }: { data: any }) {
  return (
    <div className="mt-4 p-4 border rounded">
      <h3>Carbon Footprint: {data.co2e} kg CO2e</h3>
      <p>Details: {JSON.stringify(data)}</p>
    </div>
  );
}
// ... existing code ...
