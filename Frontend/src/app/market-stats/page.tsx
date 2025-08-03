"use client";

import React, { useState, useEffect } from "react";
import { carbonApi, CarbonMarketStats } from "../services/carbonApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Leaf,
} from "lucide-react";
import ErrorBanner from "../../components/ErrorBanner";
import LocalModeIndicator from "../../components/LocalModeIndicator";

export default function MarketStatsPage() {
  const [stats, setStats] = useState<CarbonMarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketStats();
  }, []);

  const fetchMarketStats = async () => {
    try {
      setLoading(true);
      const data = await carbonApi.getCarbonMarketStats();
      setStats(data);
    } catch (err) {
      console.error("獲取市場統計失敗:", err);
      setError("無法載入市場統計數據");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            碳市場統計
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            即時碳權市場數據和趨勢分析
          </p>
        </div>

        <LocalModeIndicator />
        <ErrorBanner
          error={error}
          showLocalModeMessage={true}
          onClose={() => setError(null)}
        />

        {stats && (
          <div className="space-y-6">
            {/* 主要統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    總項目數
                  </CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(stats.total_projects)}
                  </div>
                  <p className="text-xs text-muted-foreground">活躍碳權項目</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    總代幣數
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(stats.total_tokens)}
                  </div>
                  <p className="text-xs text-muted-foreground">發行碳權代幣</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    總交易量
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.total_sales_usd)}
                  </div>
                  <p className="text-xs text-muted-foreground">累計交易金額</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    平均價格
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.average_price_usd)}
                  </div>
                  <p className="text-xs text-muted-foreground">每噸碳權均價</p>
                </CardContent>
              </Card>
            </div>

            {/* 詳細統計 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 代幣統計 */}
              <Card>
                <CardHeader>
                  <CardTitle>代幣統計</CardTitle>
                  <CardDescription>碳權代幣發行和流通情況</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">可用代幣</span>
                    <Badge variant="secondary">
                      {formatNumber(stats.total_available_tokens)} 噸
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">已註銷代幣</span>
                    <Badge variant="outline">
                      {formatNumber(stats.total_retired_tokens)} 噸
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">總交易量</span>
                    <Badge variant="default">
                      {formatNumber(stats.total_volume_tco2e)} tCO2e
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">最高價格</span>
                    <Badge variant="destructive">
                      {formatCurrency(stats.highest_price_usd)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">最低價格</span>
                    <Badge variant="secondary">
                      {formatCurrency(stats.lowest_price_usd)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* 熱門項目類型 */}
              <Card>
                <CardHeader>
                  <CardTitle>熱門項目類型</CardTitle>
                  <CardDescription>按交易量排序的項目類型</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.top_project_types.slice(0, 5).map((type, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{type.label}</span>
                        <Badge variant="outline">
                          {formatNumber(type.value)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 地理位置統計 */}
            <Card>
              <CardHeader>
                <CardTitle>熱門項目地區</CardTitle>
                <CardDescription>按交易量排序的地區分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.top_project_locations
                    .slice(0, 6)
                    .map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="text-sm font-medium">
                          {location.label}
                        </span>
                        <Badge variant="secondary">
                          {formatNumber(location.value)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* 價格歷史 */}
            {stats.price_history && stats.price_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>價格趨勢</CardTitle>
                  <CardDescription>最近價格變化</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.price_history.slice(-10).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 交易量歷史 */}
            {stats.volume_history && stats.volume_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>交易量趨勢</CardTitle>
                  <CardDescription>最近交易量變化</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.volume_history.slice(-10).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium">
                          {formatNumber(item.value)} tCO2e
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!stats && !error && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              無法載入市場統計數據
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
