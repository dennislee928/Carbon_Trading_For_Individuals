"use client";
import { useState } from "react";
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

// 定義 ComputeForm 的 props
interface ComputeFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function ComputeForm({ onResult }: ComputeFormProps) {
  const [formData, setFormData] = useState<ComputingData>({
    cpu_hours: 0,
    provider: "aws",
    region: "us-east-1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/compute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    onResult(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cpu_hours">CPU 小時數</Label>
        <Input
          id="cpu_hours"
          type="number"
          value={formData.cpu_hours}
          onChange={(e) =>
            setFormData({ ...formData, cpu_hours: Number(e.target.value) })
          }
          placeholder="請輸入 CPU 小時數"
          className="w-full"
          min="0"
          step="0.1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider">雲端服務提供商</Label>
        <Select
          value={formData.provider}
          onValueChange={(value) => {
            if (value === "aws" || value === "gcp" || value === "azure") {
              setFormData({ ...formData, provider: value });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇雲端服務提供商" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aws">AWS</SelectItem>
            <SelectItem value="gcp">Google Cloud Platform</SelectItem>
            <SelectItem value="azure">Microsoft Azure</SelectItem>
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
            <SelectItem value="us-east-1">美國東部 (US East)</SelectItem>
            <SelectItem value="us-west-2">美國西部 (US West)</SelectItem>
            <SelectItem value="eu-west-1">歐洲西部 (EU West)</SelectItem>
            <SelectItem value="ap-southeast-1">
              亞太東南部 (AP Southeast)
            </SelectItem>
            <SelectItem value="ap-northeast-1">
              亞太東北部 (AP Northeast)
            </SelectItem>
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
