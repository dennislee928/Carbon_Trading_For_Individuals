"use client";
import { useState } from "react";
import { CustomMappingData } from "../../services/types";
import { EmissionResult } from "../../services/types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/climatiq/custom-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceActivityId: formData.source_activity_id,
          targetActivityId: formData.target_activity_id,
          ratio: formData.conversion_factor,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }

      const result = await response.json();
      onResult(result);
    } catch (error) {
      console.error("自訂映射創建錯誤:", error);
      setError(error instanceof Error ? error.message : "創建失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="source_activity">來源活動 ID</Label>
        <Input
          id="source_activity"
          type="text"
          value={formData.source_activity_id}
          onChange={(e) =>
            setFormData({ ...formData, source_activity_id: e.target.value })
          }
          placeholder="請輸入來源活動 ID"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_activity">目標活動 ID</Label>
        <Input
          id="target_activity"
          type="text"
          value={formData.target_activity_id}
          onChange={(e) =>
            setFormData({ ...formData, target_activity_id: e.target.value })
          }
          placeholder="請輸入目標活動 ID"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conversion_factor">轉換係數</Label>
        <Input
          id="conversion_factor"
          type="number"
          value={formData.conversion_factor}
          onChange={(e) =>
            setFormData({
              ...formData,
              conversion_factor: Number(e.target.value),
            })
          }
          placeholder="請輸入轉換係數"
          className="w-full"
          min="0"
          step="0.01"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? "創建中..." : "創建自訂映射"}
      </Button>

      {/* 範例輸入提示 */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-2">範例輸入：</p>
        <ul className="space-y-1">
          <li>• 來源活動 ID：electricity-supply_grid-mix</li>
          <li>• 目標活動 ID：electricity-supply_solar</li>
          <li>• 轉換係數：0.5</li>
        </ul>
        <p className="text-xs mt-2 text-gray-500">
          轉換係數表示從來源活動到目標活動的轉換比例
        </p>
      </div>
    </form>
  );
}
