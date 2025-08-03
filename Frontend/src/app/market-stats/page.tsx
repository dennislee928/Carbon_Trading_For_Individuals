"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { carbonApi } from "../services/carbonApi";

interface MarketStats {
  total_projects: number;
  total_tokens: number;
  total_available_tokens: number;
  total_retired_tokens: number;
  total_volume_tco2e: number;
  total_sales_usd: number;
  average_price_usd: number;
  highest_price_usd: number;
  lowest_price_usd: number;
  top_project_types: Array<{
    label: string;
    value: number;
  }>;
  top_project_locations: Array<{
    label: string;
    value: number;
  }>;
  price_history: Array<{
    date: string;
    value: number;
  }>;
  volume_history: Array<{
    date: string;
    value: number;
  }>;
}

interface PriceHistory {
  date: string;
  price: number;
  volume: number;
}

interface TopProjects {
  id: string;
  name: string;
  volume: number;
  price: number;
  change_24h: number;
}

export default function MarketStatsPage() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [topProjects, setTopProjects] = useState<TopProjects[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchMarketStats();
  }, [timeRange]);

  const fetchMarketStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // 獲取市場統計數據
      const marketStats = await carbonApi.getCarbonMarketStats();
      setStats(marketStats);

      // 模擬價格歷史數據
      const mockPriceHistory = generateMockPriceHistory(timeRange);
      setPriceHistory(mockPriceHistory);

      // 模擬熱門項目數據
      const mockTopProjects = generateMockTopProjects();
      setTopProjects(mockTopProjects);

    } catch (err) {
      console.error("獲取市場統計失敗:", err);
      setError("獲取市場統計數據失敗");
    } finally {
      setLoading(false);
    }
  };

  const generateMockPriceHistory = (range: string): PriceHistory[] => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const data: PriceHistory[] = [];
    let basePrice = 25;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 模擬價格波動
      const change = (Math.random() - 0.5) * 0.1; // ±5% 變化
      basePrice = basePrice * (1 + change);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(basePrice.toFixed(2)),
        volume: Math.floor(Math.random() * 10000) + 1000
      });
    }
    
    return data;
  };

  const generateMockTopProjects = (): TopProjects[] => {
    return [
      {
        id: "proj-001",
        name: "亞馬遜雨林保護項目",
        volume: 15420,
        price: 28.50,
        change_24h: 5.2
      },
      {
        id: "proj-002",
        name: "中國風力發電項目",
        volume: 12850,
        price: 26.80,
        change_24h: -2.1
      },
      {
        id: "proj-003",
        name: "印度太陽能發電項目",
        volume: 9870,
        price: 24.30,
        change_24h: 3.8
      },
      {
        id: "proj-004",
        name: "巴西生物質能項目",
        volume: 7650,
        price: 22.90,
        change_24h: -1.5
      },
      {
        id: "proj-005",
        name: "歐洲海上風電項目",
        volume: 6540,
        price: 31.20,
        change_24h: 7.3
      }
    ];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">載入市場統計數據中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchMarketStats}>重試</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              市場統計
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              碳交易市場的即時統計數據和分析
            </p>
          </div>

          {/* 主要統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總交易量</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? formatCurrency(stats.total_sales_usd) : '$0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  過去24小時
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均價格</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? formatCurrency(stats.average_price_usd) : '$0'}
                </div>
                <div className="flex items-center text-xs">
                  <span className="text-green-500">
                    +2.5%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活躍用戶</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? formatNumber(stats.total_tokens) : '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  總碳權數量
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總項目數</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? formatNumber(stats.total_projects) : '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  認證項目
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 詳細統計標籤頁 */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">概覽</TabsTrigger>
              <TabsTrigger value="price">價格走勢</TabsTrigger>
              <TabsTrigger value="projects">熱門項目</TabsTrigger>
              <TabsTrigger value="volume">交易量分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>市場概況</CardTitle>
                    <CardDescription>碳交易市場的整體表現</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">總交易量</span>
                      <span className="font-medium">
                        {stats ? formatNumber(stats.total_volume_tco2e) : '0'} 噸
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">可用碳權</span>
                      <span className="font-medium">
                        {stats ? formatNumber(stats.total_available_tokens) : '0'} 噸
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">已退休碳權</span>
                      <span className="font-medium">
                        {stats ? formatNumber(stats.total_retired_tokens) : '0'} 噸
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>24小時變化</CardTitle>
                    <CardDescription>主要指標的日變化</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">價格變化</span>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">+2.5%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">交易量變化</span>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">+12.5%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">項目數量變化</span>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">+8.3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="price" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>價格走勢圖</CardTitle>
                  <CardDescription>碳權價格的歷史變化</CardDescription>
                  <div className="flex space-x-2">
                    {["7d", "30d", "90d"].map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange(range)}
                      >
                        {range === "7d" ? "7天" : range === "30d" ? "30天" : "90天"}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">價格走勢圖表</p>
                      <p className="text-sm text-gray-400 mt-2">
                        顯示 {timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"} 的價格變化
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>熱門項目</CardTitle>
                  <CardDescription>交易量最高的碳權項目</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            交易量: {formatNumber(project.volume)} 噸
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(project.price)}</p>
                          <div className="flex items-center">
                            {project.change_24h > 0 ? (
                              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={project.change_24h > 0 ? "text-green-500" : "text-red-500"}>
                              {Math.abs(project.change_24h).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volume" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>交易量分析</CardTitle>
                  <CardDescription>不同時間段的交易量分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">交易量分析圖表</p>
                      <p className="text-sm text-gray-400 mt-2">
                        顯示交易量的時間分布和趨勢
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 