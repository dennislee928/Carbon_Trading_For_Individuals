"use client";
import { useState } from "react";
import { EnergyData } from "../../services/types";
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

// 定義 EnergyForm 的 props
interface EnergyFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function EnergyForm({ onResult }: EnergyFormProps) {
  const [formData, setFormData] = useState<EnergyData>({
    energy_kwh: 0,
    region: "us-east-1",
    source: "electricity",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/energy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        energy: formData.energy_kwh,
        energy_unit: "kWh",
        energy_type: formData.source,
        country: formData.region,
      }),
    });
    const data = await response.json();
    onResult(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="energy">能源消耗 (kWh)</Label>
        <Input
          id="energy"
          type="number"
          value={formData.energy_kwh}
          onChange={(e) =>
            setFormData({ ...formData, energy_kwh: Number(e.target.value) })
          }
          placeholder="請輸入能源消耗量"
          className="w-full"
          min="0"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="energy_type">能源類型</Label>
        <Select
          value={formData.source}
          onValueChange={(value) => setFormData({ ...formData, source: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇能源類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electricity">電力</SelectItem>
            <SelectItem value="natural_gas">天然氣</SelectItem>
            <SelectItem value="coal">煤炭</SelectItem>
            <SelectItem value="oil">石油</SelectItem>
            <SelectItem value="renewable">可再生能源</SelectItem>
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
            <SelectItem value="us-east-1">美國東部</SelectItem>
            <SelectItem value="us-west-2">美國西部</SelectItem>
            <SelectItem value="eu-west-1">歐洲</SelectItem>
            <SelectItem value="ap-southeast-1">亞太 (新加坡)</SelectItem>
            <SelectItem value="ap-northeast-1">亞太 (東京)</SelectItem>
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
