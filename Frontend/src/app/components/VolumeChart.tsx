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

interface VolumeData {
  date: string;
  value: number;
}

interface VolumeChartProps {
  className?: string;
}

export default function VolumeChart({ className }: VolumeChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("90d");
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVolumeData();
  }, [timeRange]);

  const fetchVolumeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const stats = await carbonApi.getCarbonMarketStats();
      if (stats.volume_history && stats.volume_history.length > 0) {
        setVolumeData(stats.volume_history);
      } else {
        // 生成模擬數據
        const mockData = generateMockVolumeData(timeRange);
        setVolumeData(mockData);
      }
    } catch (err) {
      console.error("獲取交易量數據失敗:", err);
      setError("無法載入交易量數據");
      // 使用模擬數據
      const mockData = generateMockVolumeData(timeRange);
      setVolumeData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockVolumeData = (
    range: "7d" | "30d" | "90d"
  ): VolumeData[] => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const data: VolumeData[] = [];
    let baseVolume = 1000;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // 模擬交易量波動
      const variation = (Math.random() - 0.5) * 0.3; // ±15% 波動
      baseVolume = baseVolume * (1 + variation);

      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(baseVolume),
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

  const getCurrentVolume = () => {
    if (volumeData.length === 0) return 0;
    return volumeData[volumeData.length - 1].value;
  };

  const getVolumeChange = () => {
    if (volumeData.length < 2) return { change: 0, percentage: 0 };
    const current = volumeData[volumeData.length - 1].value;
    const previous = volumeData[volumeData.length - 2].value;
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  const volumeChange = getVolumeChange();

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">交易量分析</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          碳權交易量的歷史變化
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

        {/* 交易量摘要 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              今日交易量
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {formatVolume(getCurrentVolume())} tCO2e
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              24小時變化
            </p>
            <p
              className={`text-lg font-semibold ${
                volumeChange.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {volumeChange.change >= 0 ? "+" : ""}
              {formatVolume(volumeChange.change)}(
              {volumeChange.percentage >= 0 ? "+" : ""}
              {volumeChange.percentage.toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* 圖表區域 */}
        <div className="h-64 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="h-full">
              {/* 柱狀圖 */}
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${volumeData.length * 30} 200`}
              >
                <defs>
                  <linearGradient
                    id="volumeGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* 背景網格 */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2={volumeData.length * 30}
                    y2={i * 40}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}

                {/* 柱狀圖 */}
                {volumeData.map((data, i) => {
                  const maxValue = Math.max(...volumeData.map((d) => d.value));
                  const height = (data.value / maxValue) * 160; // 160px 最大高度
                  const x = i * 30 + 5; // 柱狀圖位置
                  const y = 200 - height - 20; // 柱狀圖頂部位置

                  return (
                    <g key={i}>
                      {/* 柱狀圖 */}
                      <rect
                        x={x}
                        y={y}
                        width="20"
                        height={height}
                        fill="url(#volumeGradient)"
                        rx="2"
                      />

                      {/* 數值標籤 */}
                      <text
                        x={x + 10}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6b7280"
                        className="text-xs"
                      >
                        {formatVolume(data.value)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X軸標籤 */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {volumeData.length > 0 && (
                  <>
                    <span>{formatDate(volumeData[0].date)}</span>
                    <span>
                      {formatDate(
                        volumeData[Math.floor(volumeData.length / 2)].date
                      )}
                    </span>
                    <span>
                      {formatDate(volumeData[volumeData.length - 1].date)}
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
            <p className="text-xs text-gray-600 dark:text-gray-400">
              最高交易量
            </p>
            <p className="font-semibold text-blue-600">
              {formatVolume(Math.max(...volumeData.map((d) => d.value)))}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              最低交易量
            </p>
            <p className="font-semibold text-red-600">
              {formatVolume(Math.min(...volumeData.map((d) => d.value)))}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              平均交易量
            </p>
            <p className="font-semibold">
              {formatVolume(
                Math.round(
                  volumeData.reduce((sum, d) => sum + d.value, 0) /
                    volumeData.length
                )
              )}
            </p>
          </div>
        </div>

        {/* 交易趨勢分析 */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">交易趨勢分析</h4>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p>
              • 過去{" "}
              {timeRange === "7d"
                ? "7天"
                : timeRange === "30d"
                ? "30天"
                : "90天"}{" "}
              平均日交易量:{" "}
              {formatVolume(
                Math.round(
                  volumeData.reduce((sum, d) => sum + d.value, 0) /
                    volumeData.length
                )
              )}{" "}
              tCO2e
            </p>
            <p>
              • 交易量趨勢: {volumeChange.percentage >= 0 ? "上升" : "下降"} (
              {Math.abs(volumeChange.percentage).toFixed(1)}%)
            </p>
            <p>
              • 市場活躍度:{" "}
              {getCurrentVolume() > 1000
                ? "高"
                : getCurrentVolume() > 500
                ? "中等"
                : "低"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
