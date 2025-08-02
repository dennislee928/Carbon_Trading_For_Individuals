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
import { carbonApi, User, Asset, Trade } from "../services/carbonApi";
import EmissionFactorsSearch from "../components/EmissionFactorsSearch";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
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
        const userData = await carbonApi.getCurrentUser();
        setUser(userData);

        if (userData.id) {
          try {
            // 使用 carbonApi 的方法來獲取資產和交易數據
            const [assetsData, tradesData] = await Promise.all([
              carbonApi.getUserAssets(userData.id),
              carbonApi.getUserTradeOrders(userData.id),
            ]);

            setAssets(assetsData);
            setTrades(tradesData);
          } catch (apiErr) {
            console.warn("API調用失敗，使用模擬數據:", apiErr);
            // 使用模擬數據作為降級
            setAssets([]);
            setTrades([]);
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
      await carbonApi.logout();
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
