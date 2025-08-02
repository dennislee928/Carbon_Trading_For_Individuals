"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiService } from "@/lib/api";
import { OverviewStats, TradeStats, UserStats } from "@/types/api";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Users, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(
    null
  );
  const [tradeStats, setTradeStats] = useState<TradeStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 設置測試 token（實際應用中應該從登入狀態獲取）
        apiService.setToken("test-token");

        const [overview, trades, users] = await Promise.all([
          apiService.getOverviewStats(),
          apiService.getTradeStats(),
          apiService.getUserStats(),
        ]);

        setOverviewStats(overview.data);
        setTradeStats(trades.data);
        setUserStats(users.data);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">總覽</h1>
            <p className="text-gray-600 mt-2">系統整體統計數據</p>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overviewStats?.total_users || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  今日新增 {formatNumber(overviewStats?.new_users_today || 0)}{" "}
                  人
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總交易數</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overviewStats?.total_trades || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  今日交易 {formatNumber(overviewStats?.trades_today || 0)} 筆
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總積分</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overviewStats?.total_points || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  活躍用戶 {formatNumber(overviewStats?.active_users || 0)} 人
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">碳信用額</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overviewStats?.total_carbon_credits || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  已完成交易{" "}
                  {formatNumber(overviewStats?.completed_trades || 0)} 筆
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 詳細統計 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 交易統計 */}
            <Card>
              <CardHeader>
                <CardTitle>交易統計</CardTitle>
                <CardDescription>交易量和狀態分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">總交易量</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(tradeStats?.total_volume || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">交易狀態分布</p>
                    <div className="space-y-2">
                      {tradeStats?.by_status.map((status) => (
                        <div
                          key={status.status}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {status.status}
                          </span>
                          <span className="text-sm font-medium">
                            {formatNumber(status.count)} 筆
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 用戶統計 */}
            <Card>
              <CardHeader>
                <CardTitle>用戶統計</CardTitle>
                <CardDescription>用戶角色和狀態分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">用戶角色分布</p>
                    <div className="space-y-2">
                      {userStats?.by_role.map((role) => (
                        <div
                          key={role.role}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {role.role}
                          </span>
                          <span className="text-sm font-medium">
                            {formatNumber(role.count)} 人
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">用戶狀態分布</p>
                    <div className="space-y-2">
                      {userStats?.by_status.map((status) => (
                        <div
                          key={status.status}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {status.status}
                          </span>
                          <span className="text-sm font-medium">
                            {formatNumber(status.count)} 人
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
