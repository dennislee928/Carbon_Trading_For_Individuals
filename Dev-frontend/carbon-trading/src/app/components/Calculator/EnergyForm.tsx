import { useState } from "react";

export default function EnergyForm({
  onResult,
}: {
  onResult: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    energy_kwh: 0,
    energy_type: "electricity",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/energy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    onResult(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.energy_kwh}
        onChange={(e) =>
          setFormData({ ...formData, energy_kwh: Number(e.target.value) })
        }
        placeholder="Energy (kWh)"
      />
      <select
        value={formData.energy_type}
        onChange={(e) =>
          setFormData({ ...formData, energy_type: e.target.value })
        }
      >
        <option value="electricity">Electricity</option>
        <option value="natural_gas">Natural Gas</option>
        <option value="coal">Coal</option>
      </select>
      <button type="submit">Calculate</button>
    </form>
  );
}
