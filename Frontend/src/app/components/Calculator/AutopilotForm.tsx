"use client";
import { useState } from "react";
import { climatiqApi } from "../../services/api";
import { AutopilotData } from "../../services/types";
import { EmissionResult } from "../../services/types";

// 定義 AutopilotForm 的 props
interface AutopilotFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function AutopilotForm({ onResult }: AutopilotFormProps) {
  const [formData, setFormData] = useState<AutopilotData>({
    description: "",
    quantity: 1,
    unit: "unit",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await climatiqApi.estimateAutopilotEmissions(formData);
      console.log("AutopilotForm API response:", result);
      // 確保 result 是可序列化的
      const serializableResult = { ...result }; // 建立一個新的物件，只包含可序列化的屬性
      // 使用 onResult 將結果傳遞給父元件
      onResult(serializableResult);
    } catch (error) {
      console.error("Error estimating autopilot emissions:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: Number(e.target.value) })
          }
          placeholder="Quantity"
          className="border p-2 w-full"
        />
        <input
          type="text"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          placeholder="Unit"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Estimate
        </button>
      </form>
    </>
  );
}
