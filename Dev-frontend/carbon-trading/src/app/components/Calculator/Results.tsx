import { EmissionResult } from "../../services/types";

export default function Results({ data }: { data: EmissionResult }) {
  return (
    <div className="mt-4 p-4 border rounded">
      <h3>Carbon Footprint: {data.co2e} kg CO2e</h3>
      <p>Details: {JSON.stringify(data)}</p>
    </div>
  );
}
