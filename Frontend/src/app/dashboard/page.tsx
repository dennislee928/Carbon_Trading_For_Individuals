"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ThemeToggle } from "@/app/components/theme-toggle";
import carbonTradingApi, {
  User,
  Asset,
  Trade,
  StatsOverview,
} from "../services/carbonApi";
import EmissionFactorsSearch from "../components/EmissionFactorsSearch";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 檢查是否有token
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // 使用 carbonApi 的 getCurrentUser 方法
        const userData = await carbonTradingApi.getCurrentUser();
        setUser(userData);

        if (userData.id) {
          // 分別處理每個 API 調用，避免一個失敗影響其他
          try {
            const assetsData = await carbonTradingApi.getUserAssets(
              userData.id
            );
            setAssets(assetsData);
          } catch (assetsErr) {
            console.warn("獲取用戶資產失敗:", assetsErr);
            setAssets([]);
          }

          try {
            const tradesData = await carbonTradingApi.getUserTradeOrders(
              userData.id
            );
            setTrades(tradesData);
          } catch (tradesErr) {
            console.warn("獲取用戶交易失敗:", tradesErr);
            setTrades([]);
          }

          try {
            const statsData = await carbonTradingApi.getStatsOverview();
            setStats(statsData);
          } catch (statsErr) {
            console.warn("獲取統計數據失敗:", statsErr);
            setStats(null);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Dashboard數據獲取失敗:", err);
          if (err.message.includes("401")) {
            router.push("/login");
          } else {
            setError("無法載入儀表板數據，請稍後再試");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // 使用 carbonApi 的 logout 方法
  const handleLogout = async () => {
    try {
      await carbonTradingApi.logout();
    } catch (err) {
      // 即使登出 API 失敗，也要清除本地 token 並導向登入頁
      console.warn("登出 API 失敗:", err);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container py-8 mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* 統計概覽卡片 */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_users?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  活躍用戶: {stats.active_users?.toLocaleString() || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總交易數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_trades?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  今日交易: {stats.trades_today || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總碳權數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_carbon_credits?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  今日新增用戶: {stats.new_users_today || 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總積分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_points?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  完成交易: {stats.completed_trades || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <EmissionFactorsSearch />
          <Card>
            <CardHeader>
              <CardTitle>我的碳資產</CardTitle>
              <CardDescription>您目前持有的碳信用額</CardDescription>
            </CardHeader>
            <CardContent>
              {assets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>類型</TableHead>
                      <TableHead>專案類型</TableHead>
                      <TableHead className="text-right">數量</TableHead>
                      <TableHead className="text-right">年份</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.credit_type}</TableCell>
                        <TableCell>{asset.project_type}</TableCell>
                        <TableCell className="text-right">
                          {asset.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {asset.vintage_year}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">您目前沒有任何碳資產</p>
              )}
              <div className="mt-6"></div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
