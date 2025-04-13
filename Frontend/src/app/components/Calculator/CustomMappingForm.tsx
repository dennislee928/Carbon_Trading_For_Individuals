"use client";
import { useState } from "react";
import { climatiqApi } from "../../services/api";
import { CustomMappingData } from "../../services/types";
import { EmissionResult } from "../../services/types";

// 定義 CustomMappingForm 的 props
interface CustomMappingFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function CustomMappingForm({
  onResult,
}: CustomMappingFormProps) {
  const [formData, setFormData] = useState<CustomMappingData>({
    source_activity_id: "",
    target_activity_id: "",
    conversion_factor: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await climatiqApi.createCustomMapping(formData);
      // 使用 onResult 將結果傳遞給父元件
      onResult(result);
    } catch (error) {
      console.error("Error creating custom mapping:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.source_activity_id}
          onChange={(e) =>
            setFormData({ ...formData, source_activity_id: e.target.value })
          }
          placeholder="Source Activity ID"
          className="border p-2 w-full"
        />
        <input
          type="text"
          value={formData.target_activity_id}
          onChange={(e) =>
            setFormData({ ...formData, target_activity_id: e.target.value })
          }
          placeholder="Target Activity ID"
          className="border p-2 w-full"
        />
        <input
          type="number"
          value={formData.conversion_factor}
          onChange={(e) =>
            setFormData({
              ...formData,
              conversion_factor: Number(e.target.value),
            })
          }
          placeholder="Conversion Factor"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Create Mapping
        </button>
      </form>
    </>
  );
}
