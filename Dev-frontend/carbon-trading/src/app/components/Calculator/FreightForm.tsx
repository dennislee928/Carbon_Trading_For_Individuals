"use client";
import { useState } from "react";
import { FreightEmissionRequest } from "../../services/types"; // 導入 FreightEmissionRequest
//

export default function FreightForm() {
  const [formData, setFormData] = useState<FreightEmissionRequest>({
    distance_km: 0,
    weight_kg: 0,
    transport_mode: "road",
    route: [],
    cargo: {
      weight: 0,
      weight_unit: "kg",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/freight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setResult(data);
  };

  const [result, setResult] = useState<any>(null);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={formData.distance_km}
          onChange={(e) =>
            setFormData({ ...formData, distance_km: Number(e.target.value) })
          }
          placeholder="Distance (km)"
        />
        <input
          type="number"
          value={formData.weight_kg}
          onChange={(e) =>
            setFormData({ ...formData, weight_kg: Number(e.target.value) })
          }
          placeholder="Weight (kg)"
        />
        <select
          value={formData.transport_mode}
          onChange={(e) =>
            setFormData({ ...formData, transport_mode: e.target.value })
          }
        >
          <option value="road">Road</option>
          <option value="rail">Rail</option>
          <option value="air">Air</option>
        </select>
        <button type="submit">Calculate</button>
      </form>
      {result && (
        <div>
          <p>Result: {JSON.stringify(result)}</p>
        </div>
      )}
    </>
  );
}
// ... existing code ...
