"use client";
import { useState } from "react";
import { ProcurementData } from "../../services/types";
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/climatiq/procurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spend: formData.spend,
          spend_unit: formData.spend_unit,
          category: formData.category,
          region: formData.region,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }

      const result = await response.json();
      onResult(result);
    } catch (error) {
      console.error("採購碳排計算錯誤:", error);
      setError(error instanceof Error ? error.message : "計算失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="spend">支出金額</Label>
        <Input
          id="spend"
          type="number"
          value={formData.spend}
          onChange={(e) =>
            setFormData({ ...formData, spend: Number(e.target.value) })
          }
          placeholder="請輸入支出金額"
          className="w-full"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spend_unit">貨幣單位</Label>
        <Select
          value={formData.spend_unit}
          onValueChange={(value) =>
            setFormData({ ...formData, spend_unit: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇貨幣單位" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TWD">新台幣 (TWD)</SelectItem>
            <SelectItem value="USD">美元 (USD)</SelectItem>
            <SelectItem value="EUR">歐元 (EUR)</SelectItem>
            <SelectItem value="JPY">日圓 (JPY)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">採購類別</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇採購類別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="office_supplies">辦公用品</SelectItem>
            <SelectItem value="electronics">電子產品</SelectItem>
            <SelectItem value="furniture">家具</SelectItem>
            <SelectItem value="food">食品</SelectItem>
            <SelectItem value="clothing">服裝</SelectItem>
            <SelectItem value="transportation">交通運輸</SelectItem>
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
            <SelectItem value="TW">台灣 (TW)</SelectItem>
            <SelectItem value="US">美國 (US)</SelectItem>
            <SelectItem value="EU">歐盟 (EU)</SelectItem>
            <SelectItem value="CN">中國 (CN)</SelectItem>
            <SelectItem value="JP">日本 (JP)</SelectItem>
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
        {isLoading ? "計算中..." : "計算採購碳排放"}
      </Button>

      {/* 範例輸入提示 */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-2">範例輸入：</p>
        <ul className="space-y-1">
          <li>• 支出金額：10000</li>
          <li>• 貨幣單位：新台幣 (TWD)</li>
          <li>• 採購類別：辦公用品</li>
          <li>• 地區：台灣 (TW)</li>
        </ul>
      </div>
    </form>
  );
}
