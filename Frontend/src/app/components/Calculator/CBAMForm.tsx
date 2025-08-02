"use client";
import { useState } from "react";
import { CBAMData } from "../../services/types";
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

// 定義 CBAMForm 的 props
interface CBAMFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function CBAMForm({ onResult }: CBAMFormProps) {
  const [formData, setFormData] = useState<CBAMData>({
    product: "",
    weight_kg: 0,
    region: "EU",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/climatiq/cbam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.product,
          quantity: formData.weight_kg,
          region: formData.region,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }

      const result = await response.json();
      onResult(result);
    } catch (error) {
      console.error("CBAM 碳排計算錯誤:", error);
      setError(error instanceof Error ? error.message : "計算失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product">產品名稱</Label>
        <Input
          id="product"
          type="text"
          value={formData.product}
          onChange={(e) =>
            setFormData({ ...formData, product: e.target.value })
          }
          placeholder="請輸入產品名稱"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">重量 (公斤)</Label>
        <Input
          id="weight"
          type="number"
          value={formData.weight_kg}
          onChange={(e) =>
            setFormData({ ...formData, weight_kg: Number(e.target.value) })
          }
          placeholder="請輸入產品重量"
          className="w-full"
          min="0"
          step="0.1"
          required
        />
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
            <SelectItem value="EU">歐盟 (EU)</SelectItem>
            <SelectItem value="US">美國 (US)</SelectItem>
            <SelectItem value="CN">中國 (CN)</SelectItem>
            <SelectItem value="JP">日本 (JP)</SelectItem>
            <SelectItem value="KR">韓國 (KR)</SelectItem>
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
        {isLoading ? "計算中..." : "計算 CBAM 碳排放"}
      </Button>

      {/* 範例輸入提示 */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-2">範例輸入：</p>
        <ul className="space-y-1">
          <li>• 產品：鋼鐵</li>
          <li>• 重量：1000 公斤</li>
          <li>• 地區：歐盟 (EU)</li>
        </ul>
      </div>
    </form>
  );
}
