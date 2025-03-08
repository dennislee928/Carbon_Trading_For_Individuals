import { useState } from "react";
import { climatiqApi } from "../../services/api";
import { CBAMData } from "../../services/types";

export default function CBAMForm({
  onResult,
}: {
  onResult: (data: any) => void;
}) {
  const [formData, setFormData] = useState<CBAMData>({
    product: "",
    weight_kg: 0,
    region: "EU",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await climatiqApi.calculateCBAMEmissions(formData);
      onResult(result);
    } catch (error) {
      console.error("Error calculating CBAM emissions:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.product}
        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
        placeholder="Product"
        className="border p-2 w-full"
      />
      <input
        type="number"
        value={formData.weight_kg}
        onChange={(e) =>
          setFormData({ ...formData, weight_kg: Number(e.target.value) })
        }
        placeholder="Weight (kg)"
        className="border p-2 w-full"
      />
      <select
        value={formData.region}
        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        className="border p-2 w-full"
      >
        <option value="EU">EU</option>
        {/* Add other regions as needed */}
      </select>
      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Calculate
      </button>
    </form>
  );
}
