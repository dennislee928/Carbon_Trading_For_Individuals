"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { ThemeToggle } from "../../components/theme-toggle";
import { carbonApi, User, Asset, Trade } from "../../services/carbonApi";

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
        const userData = await carbonApi.getCurrentUser();
        setUser(userData);

        if (userData.id) {
          const [assetsData, tradesData] = await Promise.all([
            carbonApi.getUserAssets(userData.id),
            carbonApi.getUserTradeOrders(userData.id),
          ]);

          setAssets(assetsData);
          setTrades(tradesData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          // 如果是401錯誤，重定向到登入頁面
          if (err.message.includes("401")) {
            router.push("/Login");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await carbonApi.logout();
    router.push("/Login");
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
      <header className="border-b dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">碳交易平台</h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm">您好，{user.name || user.email}</span>
            )}
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              登出
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
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
              <div className="mt-6">
                <Button onClick={() => router.push("/market")}>
                  前往交易市場
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>我的交易訂單</CardTitle>
              <CardDescription>您的買賣訂單狀態</CardDescription>
            </CardHeader>
            <CardContent>
              {trades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>訂單類型</TableHead>
                      <TableHead className="text-right">數量</TableHead>
                      <TableHead className="text-right">價格</TableHead>
                      <TableHead>狀態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>
                          {trade.order_type === "buy" ? "購買" : "出售"}
                        </TableCell>
                        <TableCell className="text-right">
                          {trade.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${trade.price}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              trade.status === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : trade.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {trade.status === "completed"
                              ? "已完成"
                              : trade.status === "pending"
                              ? "處理中"
                              : trade.status === "cancelled"
                              ? "已取消"
                              : trade.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">您目前沒有任何交易訂單</p>
              )}
              <div className="mt-6">
                <Button onClick={() => router.push("/trades/new")}>
                  建立新交易
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
