import { TravelData } from "@/app/services/types";
import { useState } from "react";
import { EmissionResult } from "../../services/types";
//

// 定義 TravelForm 的 props
interface TravelFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function TravelForm({ onResult }: TravelFormProps) {
  const [formData, setFormData] = useState<TravelData>({
    distance_km: 0,
    travel_mode: "car",
    passengers: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/travel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log("TravelForm API response:", data);
    onResult(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.distance_km}
        onChange={(e) =>
          setFormData({ ...formData, distance_km: Number(e.target.value) })
        }
        placeholder="Distance (km)"
      />
      <select
        value={formData.travel_mode}
        onChange={(e) =>
          setFormData({ ...formData, travel_mode: e.target.value })
        }
      >
        <option value="car">Car</option>
        <option value="train">Train</option>
        <option value="plane">Plane</option>
      </select>
      <button type="submit">Calculate</button>
    </form>
  );
}
