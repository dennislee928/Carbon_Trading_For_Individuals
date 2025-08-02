"use client";

import React, { useState, useEffect } from "react";
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
import { carbonApi, User, Trade } from "../services/carbonApi";
import ErrorBanner from "../../components/ErrorBanner";
import LocalModeIndicator from "../../components/LocalModeIndicator";

export default function TradeHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const userData = await carbonApi.getCurrentUser();
        setUser(userData);

        if (userData.id && userData.id !== "local-user") {
          try {
            const tradeHistory = await carbonApi.getUserTradeHistory(
              userData.id
            );
            setTrades(tradeHistory);
          } catch (tradeErr) {
            console.warn("無法獲取交易歷史，使用空數據:", tradeErr);
            setTrades([]);
          }
        } else {
          // 本地用戶，顯示空數據
          setTrades([]);
        }
      } catch (err) {
        console.error("獲取用戶資料失敗:", err);
        setError("無法載入交易歷史");
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();
  }, [router]);

  const handleBackToDashboard = () => {
    router.push("/dashboard");
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
      <header className="bg-green-600 dark:bg-green-800 text-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                碳交易平台
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  首頁
                </Link>
                <Link
                  href="/market"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  交易市場
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-green-900 transition"
                >
                  我的資產
                </Link>
                <Link
                  href="/trade-history"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-700 dark:bg-green-900 transition"
                >
                  交易歷史
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm">您好，{user.name || user.email}</span>
              )}
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="text-white border-white hover:bg-green-700"
              >
                返回儀表板
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-8 mx-auto">
        <LocalModeIndicator />
        <ErrorBanner
          error={error}
          showLocalModeMessage={true}
          onClose={() => setError(null)}
        />

        <Card>
          <CardHeader>
            <CardTitle>交易歷史記錄</CardTitle>
            <CardDescription>您的所有碳信用額交易記錄</CardDescription>
          </CardHeader>
          <CardContent>
            {trades.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易日期</TableHead>
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
                        {trade.created_at
                          ? new Date(trade.created_at).toLocaleDateString(
                              "zh-TW"
                            )
                          : "未知"}
                      </TableCell>
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
              <div className="text-center py-8">
                <p className="text-muted-foreground">您目前沒有任何交易記錄</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
