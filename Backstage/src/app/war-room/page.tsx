"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { PieChart } from "@/components/dashboard/PieChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RealTimeMetrics } from "@/components/dashboard/RealTimeMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/api";
import {
  OverviewStats,
  TradeStats,
  UserStats,
  ErrorLogStats,
  OrderBookData,
} from "@/types/api";
import {
  AlertTriangle,
  Activity,
  BarChart3,
  Clock,
  Target,
  Zap,
  Shield,
  Globe,
  Database,
  Server,
  Wifi,
  WifiOff,
  Bell,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface SystemStatus {
  service: string;
  status: "online" | "offline" | "warning";
  responseTime: number;
  uptime: number;
  lastCheck: string;
}

export default function WarRoomPage() {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(
    null
  );
  const [tradeStats, setTradeStats] = useState<TradeStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorLogStats | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);

  // 模擬警報數據
  const mockAlerts: Alert[] = [
    {
      id: "1",
      type: "critical",
      title: "數據庫連接異常",
      message: "主數據庫響應時間超過 5 秒",
      timestamp: new Date().toISOString(),
      resolved: false,
    },
    {
      id: "2",
      type: "warning",
      title: "高 CPU 使用率",
      message: "服務器 CPU 使用率達到 85%",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: false,
    },
    {
      id: "3",
      type: "info",
      title: "系統維護通知",
      message: "計劃於今晚 2:00 進行系統維護",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      resolved: false,
    },
  ];

  // 模擬系統狀態
  const mockSystemStatus: SystemStatus[] = [
    {
      service: "API Gateway",
      status: "online",
      responseTime: 45,
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
    },
    {
      service: "Database",
      status: "warning",
      responseTime: 1200,
      uptime: 99.5,
      lastCheck: new Date().toISOString(),
    },
    {
      service: "Cache Service",
      status: "online",
      responseTime: 12,
      uptime: 99.8,
      lastCheck: new Date().toISOString(),
    },
    {
      service: "Payment Gateway",
      status: "online",
      responseTime: 89,
      uptime: 99.7,
      lastCheck: new Date().toISOString(),
    },
    {
      service: "File Storage",
      status: "offline",
      responseTime: 0,
      uptime: 0,
      lastCheck: new Date().toISOString(),
    },
  ];

  // 模擬實時指標
  const mockRealTimeMetrics = [
    {
      id: "1",
      name: "活躍用戶",
      value: 1247,
      unit: "人",
      trend: "up" as const,
      change: 12,
      status: "online" as const,
    },
    {
      id: "2",
      name: "交易量",
      value: 89234,
      unit: "筆",
      trend: "up" as const,
      change: 8,
      status: "online" as const,
    },
    {
      id: "3",
      name: "系統負載",
      value: 85,
      unit: "%",
      trend: "up" as const,
      change: 15,
      status: "warning" as const,
    },
    {
      id: "4",
      name: "響應時間",
      value: 145,
      unit: "ms",
      trend: "down" as const,
      change: 5,
      status: "online" as const,
    },
    {
      id: "5",
      name: "錯誤率",
      value: 2.3,
      unit: "%",
      trend: "up" as const,
      change: 0.5,
      status: "warning" as const,
    },
    {
      id: "6",
      name: "內存使用",
      value: 78,
      unit: "%",
      trend: "stable" as const,
      change: 1,
      status: "online" as const,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        apiService.setToken("test-token");

        const [overview, trades, users, errors, orders] = await Promise.all([
          apiService.getOverviewStats(),
          apiService.getTradeStats(),
          apiService.getUserStats(),
          apiService.getErrorLogStats(),
          apiService.getOrderBook(),
        ]);

        setOverviewStats(overview.data);
        setTradeStats(trades.data);
        setUserStats(users.data);
        setErrorStats(errors.data);
        setOrderBook(orders.data);
        setAlerts(mockAlerts);
        setSystemStatus(mockSystemStatus);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: SystemStatus["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: SystemStatus["status"]) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-8">
          {/* 頁面標題 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  戰情局監控中心
                </h1>
                <p className="text-gray-600 mt-2">
                  實時監控系統狀態、警報和性能指標
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  設置
                </Button>
              </div>
            </div>
          </div>

          {/* 警報摘要 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">系統警報</h2>
              <Badge className="bg-red-100 text-red-800">
                {alerts.filter((a) => !a.resolved).length} 個未解決
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts
                .filter((a) => !a.resolved)
                .map((alert) => (
                  <Card
                    key={alert.id}
                    className={`border-l-4 border-l-red-500 ${getAlertColor(
                      alert.type
                    )}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          {alert.title}
                        </CardTitle>
                        <Badge className={getAlertColor(alert.type)}>
                          {alert.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <p className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* 實時指標 */}
          <div className="mb-8">
            <RealTimeMetrics
              metrics={mockRealTimeMetrics}
              title="實時性能指標"
              refreshInterval={15000}
            />
          </div>

          {/* 系統狀態和圖表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 系統服務狀態 */}
            <ChartCard
              title="系統服務狀態"
              description="各服務運行狀態和響應時間"
              icon={Server}
            >
              <div className="space-y-4">
                {systemStatus.map((service) => (
                  <div
                    key={service.service}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-gray-500">
                          響應時間: {service.responseTime}ms
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        可用性: {service.uptime}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* 錯誤趨勢 */}
            <ChartCard
              title="錯誤趨勢"
              description="過去 24 小時錯誤發生趨勢"
              icon={AlertTriangle}
            >
              <TrendChart
                data={
                  errorStats?.errors_by_hour.map((item) => ({
                    date: `${item.hour}:00`,
                    value: item.count,
                  })) || []
                }
                title="錯誤數量"
                color="#ef4444"
                type="line"
                height={300}
              />
            </ChartCard>
          </div>

          {/* 詳細監控 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 錯誤類型分布 */}
            <ChartCard
              title="錯誤類型分布"
              description="系統錯誤分類統計"
              icon={AlertTriangle}
            >
              <PieChart
                data={
                  errorStats?.errors_by_type.map((item) => ({
                    name: item.error_type,
                    value: item.count,
                  })) || []
                }
                title="錯誤類型"
                height={250}
              />
            </ChartCard>

            {/* 端點錯誤統計 */}
            <ChartCard
              title="端點錯誤統計"
              description="各 API 端點錯誤數量"
              icon={Database}
            >
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {errorStats?.errors_by_endpoint.map((endpoint) => (
                  <div
                    key={endpoint.endpoint}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span className="text-sm font-mono">
                      {endpoint.endpoint}
                    </span>
                    <Badge variant="destructive">{endpoint.count}</Badge>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* 系統性能指標 */}
            <ChartCard
              title="系統性能指標"
              description="關鍵性能指標"
              icon={Activity}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">平均響應時間</span>
                  <span className="font-bold">
                    {errorStats?.average_response_time_ms || 0}ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">總錯誤數</span>
                  <span className="font-bold text-red-600">
                    {errorStats?.total_errors || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">今日錯誤</span>
                  <span className="font-bold text-orange-600">
                    {errorStats?.today_errors || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">未解決錯誤</span>
                  <span className="font-bold text-red-600">
                    {errorStats?.unresolved_errors || 0}
                  </span>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* 活動日誌 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed
              activities={[
                {
                  id: "1",
                  type: "error",
                  title: "數據庫連接超時",
                  description: "主數據庫響應時間超過閾值",
                  timestamp: new Date().toISOString(),
                  status: "error",
                },
                {
                  id: "2",
                  type: "system",
                  title: "自動備份完成",
                  description: "每日數據庫備份已成功完成",
                  timestamp: new Date(Date.now() - 300000).toISOString(),
                  status: "success",
                },
                {
                  id: "3",
                  type: "trade",
                  title: "大額交易警報",
                  description: "檢測到一筆超過 $100,000 的交易",
                  timestamp: new Date(Date.now() - 600000).toISOString(),
                  status: "warning",
                },
              ]}
              title="系統活動日誌"
              maxItems={10}
            />

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重啟所有服務
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    清理緩存
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    安全掃描
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    發送測試通知
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
