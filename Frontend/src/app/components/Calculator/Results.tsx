import { EmissionResult } from "../../services/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Leaf, TrendingUp, Info } from "lucide-react";

export default function Results({ data }: { data: EmissionResult }) {
  const getEmissionLevel = (co2e: number) => {
    if (co2e < 10) return { level: "低", color: "bg-green-100 text-green-800" };
    if (co2e < 50)
      return { level: "中", color: "bg-yellow-100 text-yellow-800" };
    return { level: "高", color: "bg-red-100 text-red-800" };
  };

  const emissionLevel = getEmissionLevel(data.co2e);

  return (
    <Card className="mt-6 border-green-200 bg-green-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Leaf className="h-5 w-5" />
          碳排放計算結果
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              {data.co2e} kg CO2e
            </span>
            <Badge className={emissionLevel.color}>
              {emissionLevel.level}排放
            </Badge>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">活動資訊</h4>
            <div className="text-sm text-gray-600">
              <p>
                <strong>活動 ID:</strong> {data.activity_id}
              </p>
              <p>
                <strong>單位:</strong> {data.co2e_unit}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">計算參數</h4>
            <div className="text-sm text-gray-600">
              {data.parameters &&
                Object.entries(data.parameters).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "number" ? value.toFixed(2) : value}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">碳足跡說明</p>
              <p>
                您的活動產生了 {data.co2e} kg CO2e 的碳排放。
                {emissionLevel.level === "低" &&
                  " 這是一個相對較低的排放量，請繼續保持環保的生活方式。"}
                {emissionLevel.level === "中" &&
                  " 這是一個中等水平的排放量，建議考慮減少不必要的活動或選擇更環保的替代方案。"}
                {emissionLevel.level === "高" &&
                  " 這是一個較高的排放量，建議積極尋找減少碳排放的方法，如使用可再生能源或選擇低碳交通方式。"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
