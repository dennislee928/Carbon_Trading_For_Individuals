// ... existing code ...
import { useState } from "react";
import FreightForm from "./FreightForm";
import TravelForm from "./TravelForm";
import EnergyForm from "./EnergyForm";
import ComputeForm from "./ComputeForm";
import Results from "./Results";

export default function ClimatiqCalculator() {
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("freight");

  const handleResult = (data: any) => setResults(data);

  return (
    <div className="p-4">
      <div className="tabs mb-4">
        <button onClick={() => setActiveTab("freight")}>Freight</button>
        <button onClick={() => setActiveTab("travel")}>Travel</button>
        <button onClick={() => setActiveTab("energy")}>Energy</button>
        <button onClick={() => setActiveTab("compute")}>Compute</button>
      </div>

      {activeTab === "freight" && <FreightForm onResult={handleResult} />}
      {activeTab === "travel" && <TravelForm onResult={handleResult} />}
      {activeTab === "energy" && <EnergyForm onResult={handleResult} />}
      {activeTab === "compute" && <ComputeForm onResult={handleResult} />}

      {results && <Results data={results} />}
    </div>
  );
}
// ... existing code ...
