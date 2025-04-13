"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ThemeToggle } from "../../components/theme-toggle";
import { carbonApi, User, Trade } from "../../services/carbonApi";

export default function TradeHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all"); // all, buy, sell

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        // 獲取當前用戶資訊
        const userData = await carbonApi.getCurrentUser();
        setUser(userData);

        if (userData.id) {
          // 獲取交易歷史
          const tradesData = await carbonApi.getUserTradeHistory(userData.id);
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

    fetchTradeHistory();
  }, [router]);

  // 篩選交易歷史
  const filteredTrades = trades.filter((trade) => {
    if (filter === "all") return true;
    return trade.order_type === filter;
  });

  // 格式化日期時間
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "未知";
    return new Date(dateString).toLocaleString();
  };

  // 計算總交易金額
  const getTotalAmount = (type: string) => {
    return trades
      .filter((trade) => trade.order_type === type)
      .reduce((acc, trade) => acc + trade.quantity * trade.price, 0)
      .toFixed(2);
  };

  // 計算交易數量
  const getTradeCount = (type: string) => {
    return trades.filter((trade) => trade.order_type === type).length;
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
          <h1 className="text-xl font-bold">交易歷史</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              返回儀表板
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">總交易次數</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{trades.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">購買交易</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTradeCount("buy")}</p>
              <p className="text-sm text-muted-foreground">
                總金額: ${getTotalAmount("buy")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">出售交易</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTradeCount("sell")}</p>
              <p className="text-sm text-muted-foreground">
                總金額: ${getTotalAmount("sell")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>交易紀錄</CardTitle>
                <CardDescription>您所有的交易歷史紀錄</CardDescription>
              </div>
              <div className="mt-4 md:mt-0 w-full md:w-auto">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="篩選交易類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部交易</SelectItem>
                    <SelectItem value="buy">僅購買交易</SelectItem>
                    <SelectItem value="sell">僅出售交易</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTrades.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易類型</TableHead>
                    <TableHead className="text-right">數量</TableHead>
                    <TableHead className="text-right">單價</TableHead>
                    <TableHead className="text-right">總金額</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            trade.order_type === "buy"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {trade.order_type === "buy" ? "購買" : "出售"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {trade.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${trade.price}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(trade.quantity * trade.price).toFixed(2)}
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
                            : trade.status || "未知"}
                        </span>
                      </TableCell>
                      <TableCell>{formatDateTime(trade.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  沒有找到符合條件的交易紀錄
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button onClick={() => router.push("/trades/new")}>建立新交易</Button>
        </div>
      </main>
    </div>
  );
}
