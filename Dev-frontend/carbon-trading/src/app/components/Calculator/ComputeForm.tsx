import { useState } from "react";
import { ComputingData } from "../../services/types"; // 導入 ComputingData
// ... existing code ...

export default function ComputeForm({
  onResult,
}: {
  onResult: (data: any) => void;
}) {
  const [formData, setFormData] = useState<ComputingData>({
    cpu_hours: 0,
    provider: "aws",
    region: "us-east-1",
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
        value={formData.cpu_hours}
        onChange={(e) =>
          setFormData({ ...formData, cpu_hours: Number(e.target.value) })
        }
        placeholder="Compute Hours"
      />
      <select
        value={formData.provider}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "aws" || value === "gcp" || value === "azure") {
            setFormData({ ...formData, provider: value });
          }
        }}
      >
        <option value="aws">AWS</option>
        <option value="gcp">GCP</option>
        <option value="azure">Azure</option>
      </select>
      <button type="submit">Calculate</button>
    </form>
  );
}
