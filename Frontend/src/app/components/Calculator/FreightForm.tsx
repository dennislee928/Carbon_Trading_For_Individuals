"use client";
import { useState } from "react";
import { FreightEmissionRequest } from "../../services/types";
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

// 定義 FreightForm 的 props
interface FreightFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function FreightForm({ onResult }: FreightFormProps) {
  const [formData, setFormData] = useState<FreightEmissionRequest>({
    distance_km: 0,
    weight_kg: 0,
    transport_mode: "road",
    route: [],
    cargo: {
      weight: 0,
      weight_unit: "kg",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/freight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data: EmissionResult = await response.json();
    onResult(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="distance">距離 (公里)</Label>
        <Input
          id="distance"
          type="number"
          value={formData.distance_km}
          onChange={(e) =>
            setFormData({ ...formData, distance_km: Number(e.target.value) })
          }
          placeholder="請輸入運輸距離"
          className="w-full"
          min="0"
          step="0.1"
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
          placeholder="請輸入貨物重量"
          className="w-full"
          min="0"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transport_mode">運輸方式</Label>
        <Select
          value={formData.transport_mode}
          onValueChange={(value) =>
            setFormData({ ...formData, transport_mode: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇運輸方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="road">公路運輸</SelectItem>
            <SelectItem value="rail">鐵路運輸</SelectItem>
            <SelectItem value="air">航空運輸</SelectItem>
            <SelectItem value="sea">海運</SelectItem>
            <SelectItem value="inland_waterway">內河運輸</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        計算碳排放
      </Button>
    </form>
  );
}
