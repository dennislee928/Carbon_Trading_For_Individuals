import { useState } from "react";

export default function ComputeForm({
  onResult,
}: {
  onResult: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    compute_hours: 0,
    compute_type: "cloud",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/compute", {
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
        value={formData.compute_hours}
        onChange={(e) =>
          setFormData({ ...formData, compute_hours: Number(e.target.value) })
        }
        placeholder="Compute Hours"
      />
      <select
        value={formData.compute_type}
        onChange={(e) =>
          setFormData({ ...formData, compute_type: e.target.value })
        }
      >
        <option value="cloud">Cloud</option>
        <option value="on_premises">On-Premises</option>
      </select>
      <button type="submit">Calculate</button>
    </form>
  );
}
