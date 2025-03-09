"use client";
import { useState } from "react";
import { ComputingData } from "../../services/types"; // 導入 ComputingData
import { EmissionResult } from "../../services/types";

// 定義 ComputeForm 的 props
interface ComputeFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function ComputeForm({ onResult }: ComputeFormProps) {
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
    // 使用 onResult 將結果傳遞給父元件
    onResult(data);
  };

  return (
    <>
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
    </>
  );
}
