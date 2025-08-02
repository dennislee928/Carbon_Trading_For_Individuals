"use client";
import { useState } from "react";
import { AutopilotData } from "../../services/types";
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/climatiq/autopilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          quantity: formData.quantity,
          unit: formData.unit,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }

      const result = await response.json();
      onResult(result);
    } catch (error) {
      console.error("自動駕駛碳排計算錯誤:", error);
      setError(error instanceof Error ? error.message : "計算失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">活動描述</Label>
        <Input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="請描述您的活動（例如：AI 訓練、自動駕駛等）"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">數量</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: Number(e.target.value) })
          }
          placeholder="請輸入數量"
          className="w-full"
          min="0"
          step="0.1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">單位</Label>
        <Select
          value={formData.unit}
          onValueChange={(value) => setFormData({ ...formData, unit: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇單位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unit">個</SelectItem>
            <SelectItem value="hour">小時</SelectItem>
            <SelectItem value="day">天</SelectItem>
            <SelectItem value="month">月</SelectItem>
            <SelectItem value="year">年</SelectItem>
          </SelectContent>
        </Select>
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
        {isLoading ? "計算中..." : "估算碳排放"}
      </Button>

      {/* 範例輸入提示 */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-2">範例輸入：</p>
        <ul className="space-y-1">
          <li>• 活動描述：AI 模型訓練</li>
          <li>• 數量：100</li>
          <li>• 單位：小時</li>
        </ul>
      </div>
    </form>
  );
}
