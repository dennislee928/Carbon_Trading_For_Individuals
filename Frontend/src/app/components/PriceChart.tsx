"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { carbonApi } from "../services/carbonApi";

interface PriceData {
  date: string;
  value: number;
}

interface PriceChartProps {
  className?: string;
}

export default function PriceChart({ className }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("90d");
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPriceData();
  }, [timeRange]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const stats = await carbonApi.getCarbonMarketStats();
      if (stats.price_history && stats.price_history.length > 0) {
        setPriceData(stats.price_history);
      } else {
        // 生成模擬數據
        const mockData = generateMockPriceData(timeRange);
        setPriceData(mockData);
      }
    } catch (err) {
      console.error("獲取價格數據失敗:", err);
      setError("無法載入價格數據");
      // 使用模擬數據
      const mockData = generateMockPriceData(timeRange);
      setPriceData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPriceData = (range: "7d" | "30d" | "90d"): PriceData[] => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const data: PriceData[] = [];
    let basePrice = 25;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // 模擬價格波動
      const variation = (Math.random() - 0.5) * 0.1; // ±5% 波動
      basePrice = basePrice * (1 + variation);

      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(basePrice * 100) / 100,
      });
    }

    return data;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      month: "short",
      day: "numeric",
    });
  };

  const getCurrentPrice = () => {
    if (priceData.length === 0) return 0;
    return priceData[priceData.length - 1].value;
  };

  const getPriceChange = () => {
    if (priceData.length < 2) return { change: 0, percentage: 0 };
    const current = priceData[priceData.length - 1].value;
    const previous = priceData[priceData.length - 2].value;
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  const priceChange = getPriceChange();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">價格走勢圖</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          碳權價格的歷史變化
        </p>
      </CardHeader>
      <CardContent>
        {/* 時間範圍選擇 */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: "7d" as const, label: "7天" },
            { key: "30d" as const, label: "30天" },
            { key: "90d" as const, label: "90天" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={timeRange === key ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(key)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* 價格摘要 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">當前價格</p>
            <p className="text-2xl font-bold text-green-600">
              ${getCurrentPrice().toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              24小時變化
            </p>
            <p
              className={`text-lg font-semibold ${
                priceChange.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {priceChange.change >= 0 ? "+" : ""}
              {priceChange.change.toFixed(2)}(
              {priceChange.percentage >= 0 ? "+" : ""}
              {priceChange.percentage.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* 圖表區域 */}
        <div className="h-64 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="h-full">
              {/* 簡化的線條圖 */}
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${priceData.length * 20} 200`}
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* 背景網格 */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2={priceData.length * 20}
                    y2={i * 40}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}

                {/* 價格線條 */}
                {priceData.length > 1 && (
                  <>
                    {/* 填充區域 */}
                    <path
                      d={`M 0 ${
                        200 - (priceData[0].value / 50) * 200
                      } ${priceData
                        .map(
                          (data, i) =>
                            `L ${i * 20} ${200 - (data.value / 50) * 200}`
                        )
                        .join(" ")} L ${
                        (priceData.length - 1) * 20
                      } 200 L 0 200 Z`}
                      fill="url(#priceGradient)"
                    />

                    {/* 線條 */}
                    <path
                      d={`M 0 ${
                        200 - (priceData[0].value / 50) * 200
                      } ${priceData
                        .map(
                          (data, i) =>
                            `L ${i * 20} ${200 - (data.value / 50) * 200}`
                        )
                        .join(" ")}`}
                      stroke="#10b981"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* 數據點 */}
                    {priceData.map((data, i) => (
                      <circle
                        key={i}
                        cx={i * 20}
                        cy={200 - (data.value / 50) * 200}
                        r="3"
                        fill="#10b981"
                      />
                    ))}
                  </>
                )}
              </svg>

              {/* X軸標籤 */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {priceData.length > 0 && (
                  <>
                    <span>{formatDate(priceData[0].date)}</span>
                    <span>
                      {formatDate(
                        priceData[Math.floor(priceData.length / 2)].date
                      )}
                    </span>
                    <span>
                      {formatDate(priceData[priceData.length - 1].date)}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 統計信息 */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">最高價</p>
            <p className="font-semibold text-green-600">
              ${Math.max(...priceData.map((d) => d.value)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">最低價</p>
            <p className="font-semibold text-red-600">
              ${Math.min(...priceData.map((d) => d.value)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">平均價</p>
            <p className="font-semibold">
              $
              {(
                priceData.reduce((sum, d) => sum + d.value, 0) /
                priceData.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
