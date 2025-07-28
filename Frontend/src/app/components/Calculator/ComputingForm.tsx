"use client";
import { useState } from "react";
import { climatiqApi } from "../../services/api";
import { ComputingData } from "../../services/types";
import { EmissionResult } from "../../services/types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

// 定義 ComputingForm 的 props
interface ComputingFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function ComputingForm({ onResult }: ComputingFormProps) {
  const [formData, setFormData] = useState<ComputingData>({
    duration_hours: 0,
    compute_type: "cloud",
    region: "us-east-1",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 使用 estimate 端點來計算計算碳排放
      // 根據 Climatiq API 文檔，使用適當的 emission factor
      const estimateData = {
        emission_factor: {
          activity_id: "electricity-supply_grid-mix",
          data_version: "^3",
        },
        parameters: {
          energy: formData.duration_hours * 0.5, // 假設每小時消耗 0.5 kWh
          energy_unit: "kWh",
        },
      };

      const result = await climatiqApi.estimateEmissions(estimateData as any);
      onResult(result);
    } catch (error) {
      console.error("Error calculating computing emissions:", error);
      setError("計算碳排放時發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="duration">計算時長 (小時)</Label>
        <Input
          id="duration"
          type="number"
          value={formData.duration_hours}
          onChange={(e) =>
            setFormData({ ...formData, duration_hours: Number(e.target.value) })
          }
          placeholder="請輸入計算時長"
          className="w-full"
          min="0"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="compute_type">計算類型</Label>
        <Select
          value={formData.compute_type}
          onValueChange={(value) =>
            setFormData({ ...formData, compute_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇計算類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cloud">雲端計算</SelectItem>
            <SelectItem value="edge">邊緣計算</SelectItem>
            <SelectItem value="local">本地計算</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">地區</Label>
        <Select
          value={formData.region}
          onValueChange={(value) => setFormData({ ...formData, region: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇地區" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us-east-1">美國東部 (N. Virginia)</SelectItem>
            <SelectItem value="us-west-2">美國西部 (Oregon)</SelectItem>
            <SelectItem value="eu-west-1">歐洲 (愛爾蘭)</SelectItem>
            <SelectItem value="ap-southeast-1">亞太 (新加坡)</SelectItem>
            <SelectItem value="ap-northeast-1">亞太 (東京)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? "計算中..." : "計算碳排放"}
      </Button>
    </form>
  );
}
