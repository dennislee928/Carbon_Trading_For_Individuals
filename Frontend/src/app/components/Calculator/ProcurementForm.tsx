"use client";
import { useState } from "react";
import { climatiqApi } from "../../services/api";
import { ProcurementData } from "../../services/types";
import { EmissionResult } from "../../services/types";

// 定義 ProcurementForm 的 props
interface ProcurementFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function ProcurementForm({ onResult }: ProcurementFormProps) {
  const [formData, setFormData] = useState<ProcurementData>({
    spend: 0,
    spend_unit: "TWD",
    category: "office_supplies",
    region: "TW",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await climatiqApi.calculateProcurementEmissions(formData);
      // 使用 onResult 將結果傳遞給父元件
      onResult(result);
    } catch (error) {
      console.error("Error calculating procurement emissions:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        value={formData.spend}
        onChange={(e) =>
          setFormData({ ...formData, spend: Number(e.target.value) })
        }
        placeholder="Spend Amount"
        className="border p-2 w-full"
      />
      <select
        value={formData.spend_unit}
        onChange={(e) =>
          setFormData({ ...formData, spend_unit: e.target.value })
        }
        className="border p-2 w-full"
      >
        <option value="TWD">TWD</option>
        <option value="USD">USD</option>
      </select>
      <input
        type="text"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="Category (e.g., office_supplies)"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Calculate
      </button>
    </form>
  );
}
