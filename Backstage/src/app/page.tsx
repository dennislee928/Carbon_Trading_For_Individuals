"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { PieChart } from "@/components/dashboard/PieChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RealTimeMetrics } from "@/components/dashboard/RealTimeMetrics";
import { apiService } from "@/lib/api";
import {
  OverviewStats,
  TradeStats,
  UserStats,
  ErrorLogStats,
  OrderBookData,
} from "@/types/api";
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Activity,
  BarChart3,
  Clock,
  Target,
  Zap,
  Shield,
  Globe,
  Database,
} from "lucide-react";

export default function DashboardPage() {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(
    null
  );
  const [tradeStats, setTradeStats] = useState<TradeStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorLogStats | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(true);

  // 模擬活動數據
  const mockActivities = [
    {
      id: "1",
      type: "user" as const,
      title: "新用戶註冊",
      description: "用戶 john.doe@example.com 完成註冊",
      timestamp: new Date().toISOString(),
      status: "success" as const,
    },
    {
      id: "2",
      type: "trade" as const,
      title: "大額交易完成",
      description: "完成一筆價值 $50,000 的碳信用交易",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "success" as const,
    },
    {
      id: "3",
      type: "error" as const,
      title: "API 錯誤",
      description: "用戶認證服務出現短暫中斷",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: "warning" as const,
    },
    {
      id: "4",
      type: "system" as const,
      title: "系統維護",
      description: "數據庫備份完成",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: "info" as const,
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
      value: 67,
      unit: "%",
      trend: "stable" as const,
      change: 2,
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
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 設置測試 token（實際應用中應該從登入狀態獲取）
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
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 準備圖表數據
  const userTrendData =
    userStats?.daily_registrations.map((item) => ({
      date: item.date,
      value: item.count,
    })) || [];

  const tradeTrendData =
    tradeStats?.daily_trades.map((item) => ({
      date: item.date,
      value: item.count,
    })) || [];

  const userRoleData =
    userStats?.by_role.map((item) => ({
      name: item.role,
      value: item.count,
    })) || [];

  const tradeStatusData =
    tradeStats?.by_status.map((item) => ({
      name: item.status,
      value: item.count,
    })) || [];

  const errorTypeData =
    errorStats?.errors_by_type.map((item) => ({
      name: item.error_type,
      value: item.count,
    })) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-8">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              戰情局儀表板
            </h1>
            <p className="text-gray-600 mt-2">
              實時監控系統狀態、用戶活動和交易動態
            </p>
          </div>

          {/* 主要統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="總用戶數"
              value={overviewStats?.total_users || 0}
              change={12}
              changeType="positive"
              icon={Users}
              description={`今日新增 ${overviewStats?.new_users_today || 0} 人`}
              delay={0.1}
            />
            <StatsCard
              title="總交易數"
              value={overviewStats?.total_trades || 0}
              change={8}
              changeType="positive"
              icon={TrendingUp}
              description={`今日交易 ${overviewStats?.trades_today || 0} 筆`}
              delay={0.2}
            />
            <StatsCard
              title="總積分"
              value={overviewStats?.total_points || 0}
              change={15}
              changeType="positive"
              icon={DollarSign}
              description={`活躍用戶 ${overviewStats?.active_users || 0} 人`}
              format="currency"
              delay={0.3}
            />
            <StatsCard
              title="碳信用額"
              value={overviewStats?.total_carbon_credits || 0}
              change={-3}
              changeType="negative"
              icon={AlertTriangle}
              description={`已完成交易 ${
                overviewStats?.completed_trades || 0
              } 筆`}
              delay={0.4}
            />
          </div>

          {/* 實時指標 */}
          <div className="mb-8">
            <RealTimeMetrics
              metrics={mockRealTimeMetrics}
              title="實時系統指標"
              refreshInterval={30000}
            />
          </div>

          {/* 圖表區域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 用戶註冊趨勢 */}
            <ChartCard
              title="用戶註冊趨勢"
              description="過去 30 天用戶註冊情況"
              icon={Users}
              delay={0.5}
            >
              <TrendChart
                data={userTrendData}
                title="用戶註冊"
                color="#3b82f6"
                type="area"
                height={300}
              />
            </ChartCard>

            {/* 交易趨勢 */}
            <ChartCard
              title="交易趨勢"
              description="過去 30 天交易量變化"
              icon={TrendingUp}
              delay={0.6}
            >
              <TrendChart
                data={tradeTrendData}
                title="交易量"
                color="#10b981"
                type="line"
                height={300}
              />
            </ChartCard>
          </div>

          {/* 分布圖表 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 用戶角色分布 */}
            <ChartCard
              title="用戶角色分布"
              description="各角色用戶數量"
              icon={Users}
              delay={0.7}
            >
              <PieChart data={userRoleData} title="用戶角色" height={250} />
            </ChartCard>

            {/* 交易狀態分布 */}
            <ChartCard
              title="交易狀態分布"
              description="各狀態交易數量"
              icon={Activity}
              delay={0.8}
            >
              <PieChart data={tradeStatusData} title="交易狀態" height={250} />
            </ChartCard>

            {/* 錯誤類型分布 */}
            <ChartCard
              title="錯誤類型分布"
              description="系統錯誤分類"
              icon={AlertTriangle}
              delay={0.9}
            >
              <PieChart data={errorTypeData} title="錯誤類型" height={250} />
            </ChartCard>
          </div>

          {/* 系統狀態和活動 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 系統狀態卡片 */}
            <div className="space-y-6">
              <ChartCard
                title="系統健康狀態"
                description="各服務運行狀態"
                icon={Shield}
                delay={1.0}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">API 服務</span>
                    </div>
                    <span className="text-sm text-green-600">正常運行</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">數據庫</span>
                    </div>
                    <span className="text-sm text-green-600">正常運行</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">緩存服務</span>
                    </div>
                    <span className="text-sm text-yellow-600">輕微延遲</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">支付系統</span>
                    </div>
                    <span className="text-sm text-green-600">正常運行</span>
                  </div>
                </div>
              </ChartCard>

              {/* 市場概況 */}
              <ChartCard
                title="市場概況"
                description="當前訂單簿狀態"
                icon={Globe}
                delay={1.1}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">買入訂單</span>
                    <span className="text-lg font-bold text-green-600">
                      {orderBook?.buy_orders.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">賣出訂單</span>
                    <span className="text-lg font-bold text-red-600">
                      {orderBook?.sell_orders.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">總交易量</span>
                    <span className="text-lg font-bold">
                      {tradeStats?.total_volume.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* 活動動態 */}
            <ActivityFeed
              activities={mockActivities}
              title="系統活動動態"
              maxItems={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
