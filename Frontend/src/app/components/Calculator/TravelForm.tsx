"use client";
import { TravelData } from "@/app/services/types";
import { useState } from "react";
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

// 定義 TravelForm 的 props
interface TravelFormProps {
  onResult: (data: EmissionResult) => void;
}

export default function TravelForm({ onResult }: TravelFormProps) {
  const [formData, setFormData] = useState<TravelData>({
    distance_km: 0,
    travel_mode: "car",
    passengers: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/climatiq/travel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log("TravelForm API response:", data);
    onResult(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="distance" className="text-black">
          距離 (公里)
        </Label>
        <Input
          id="distance"
          type="number"
          value={formData.distance_km}
          onChange={(e) =>
            setFormData({ ...formData, distance_km: Number(e.target.value) })
          }
          placeholder="請輸入旅行距離"
          className="w-full"
          min="0"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="travel_mode" className="text-black">
          交通方式
        </Label>
        <Select
          value={formData.travel_mode}
          onValueChange={(value) =>
            setFormData({ ...formData, travel_mode: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇交通方式" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            <SelectItem value="car" className="hover:bg-gray-800">
              汽車
            </SelectItem>
            <SelectItem value="train" className="hover:bg-gray-800">
              火車
            </SelectItem>
            <SelectItem value="plane" className="hover:bg-gray-800">
              飛機
            </SelectItem>
            <SelectItem value="bus" className="hover:bg-gray-800">
              公車
            </SelectItem>
            <SelectItem value="motorcycle" className="hover:bg-gray-800">
              機車
            </SelectItem>
            <SelectItem value="bicycle" className="hover:bg-gray-800">
              自行車
            </SelectItem>
            <SelectItem value="walking" className="hover:bg-gray-800">
              步行
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passengers" className="text-black">
          乘客數量
        </Label>
        <Input
          id="passengers"
          type="number"
          value={formData.passengers}
          onChange={(e) =>
            setFormData({ ...formData, passengers: Number(e.target.value) })
          }
          placeholder="請輸入乘客數量"
          className="w-full"
          min="1"
          step="1"
        />
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
