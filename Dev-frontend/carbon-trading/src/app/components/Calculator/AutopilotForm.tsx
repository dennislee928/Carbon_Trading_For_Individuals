"use client";
import { useState } from "react";
import { climatiqApi } from "../../services/api";
import { AutopilotData } from "../../services/types";

export default function AutopilotForm() {
  const [formData, setFormData] = useState<AutopilotData>({
    description: "",
    quantity: 1,
    unit: "unit",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await climatiqApi.estimateAutopilotEmissions(formData);
      //onResult(result);
      // 使用一個狀態變數來儲存結果，並在父元件中處理結果
      setResult(result);
    } catch (error) {
      console.error("Error estimating autopilot emissions:", error);
    }
  };

  const [result, setResult] = useState<any>(null); // 新增狀態變數

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
      {/* 顯示結果 */}
      {result && (
        <div>
          <p>Result: {JSON.stringify(result)}</p>
        </div>
      )}
    </>
  );
}
