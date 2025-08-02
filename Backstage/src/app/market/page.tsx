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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/lib/api";
import { OrderBookEntry } from "@/types/api";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

export default function MarketPage() {
  const [orderBook, setOrderBook] = useState<{
    buy_orders: OrderBookEntry[];
    sell_orders: OrderBookEntry[];
  }>({ buy_orders: [], sell_orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        apiService.setToken("test-token");
        const response = await apiService.getOrderBook();
        setOrderBook(response.data);
      } catch (error) {
        console.error("Failed to fetch order book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 lg:pl-64">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">市場管理</h1>
            <p className="text-gray-600 mt-2">監控碳權交易市場</p>
          </div>

          {/* 市場統計 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">買入訂單</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderBook.buy_orders.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">賣出訂單</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderBook.sell_orders.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總訂單</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderBook.buy_orders.length + orderBook.sell_orders.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 訂單簿 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 買入訂單 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  買入訂單
                </CardTitle>
                <CardDescription>用戶的買入碳權訂單</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>價格</TableHead>
                        <TableHead>數量</TableHead>
                        <TableHead>類型</TableHead>
                        <TableHead>用戶</TableHead>
                        <TableHead>時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderBook.buy_orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-bold text-green-600">
                            {formatCurrency(order.price)}
                          </TableCell>
                          <TableCell>{formatNumber(order.quantity)}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {order.credit_type}
                            </span>
                          </TableCell>
                          <TableCell>{order.user_email}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 賣出訂單 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  賣出訂單
                </CardTitle>
                <CardDescription>用戶的賣出碳權訂單</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>價格</TableHead>
                        <TableHead>數量</TableHead>
                        <TableHead>類型</TableHead>
                        <TableHead>用戶</TableHead>
                        <TableHead>時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderBook.sell_orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-bold text-red-600">
                            {formatCurrency(order.price)}
                          </TableCell>
                          <TableCell>{formatNumber(order.quantity)}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {order.credit_type}
                            </span>
                          </TableCell>
                          <TableCell>{order.user_email}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
