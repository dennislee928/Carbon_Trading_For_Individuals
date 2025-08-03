"use client";

import React, { useState, useEffect } from "react";
import {
  carbonApi,
  CarbonCredit,
  CarbonOffsetPurchase,
  OrderBookResponse,
  OrderBookEntry,
} from "../services/carbonApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Loader2,
  ShoppingCart,
  Leaf,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import ErrorBanner from "../../components/ErrorBanner";
import LocalModeIndicator from "../../components/LocalModeIndicator";

export default function MarketPage() {
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderBookLoading, setOrderBookLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] =
    useState<CarbonOffsetPurchase | null>(null);
  const [activeTab, setActiveTab] = useState<"credits" | "orderbook">(
    "credits"
  );

  useEffect(() => {
    fetchCarbonCredits();
    fetchOrderBook();
  }, []);

  const fetchCarbonCredits = async () => {
    try {
      setLoading(true);
      const credits = await carbonApi.getCarbonCredits();
      setCarbonCredits(credits);
    } catch (err) {
      console.error("獲取碳權列表失敗:", err);
      setError("無法載入碳權列表");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderBook = async () => {
    try {
      setOrderBookLoading(true);
      const data = await carbonApi.getOrderBook();
      setOrderBook(data);
    } catch (err) {
      console.error("獲取訂單簿失敗:", err);
      // Don't set error for orderbook as it's not critical
    } finally {
      setOrderBookLoading(false);
    }
  };

  const handlePurchase = async (creditId: string) => {
    try {
      setPurchasing(true);
      const result = await carbonApi.purchaseCarbonOffset({
        credit_id: creditId,
        quantity: purchaseQuantity,
      });
      setPurchaseResult(result);
      // 重新獲取碳權列表和訂單簿
      await Promise.all([fetchCarbonCredits(), fetchOrderBook()]);
    } catch (err) {
      console.error("購買失敗:", err);
      setError("購買失敗，請稍後再試");
    } finally {
      setPurchasing(false);
    }
  };

  const getCreditTypeColor = (standard: string) => {
    switch (standard) {
      case "VCS":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Gold Standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "CDM":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getProjectTypeIcon = (type: string) => {
    if (type.includes("森林") || type.includes("Forestry")) {
      return <Leaf className="h-4 w-4" />;
    }
    if (
      type.includes("能源") ||
      type.includes("Energy") ||
      type.includes("Renewable")
    ) {
      return <TrendingUp className="h-4 w-4" />;
    }
    return <Leaf className="h-4 w-4" />;
  };

  const getOrderTypeColor = (orderType: string) => {
    return orderType === "buy"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  const renderOrderBookEntry = (order: OrderBookEntry) => (
    <div
      key={order.id}
      className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-3">
        <Badge className={getOrderTypeColor(order.order_type)}>
          {order.order_type === "buy" ? "買入" : "賣出"}
        </Badge>
        <div>
          <div className="font-medium">{order.credit_type}</div>
          <div className="text-sm text-gray-500">
            {order.project_type} • {order.vintage_year}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">${order.price}</div>
        <div className="text-sm text-gray-500">{order.quantity} 噸</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            碳權交易市場
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            瀏覽和購買經過認證的碳權，為環境保護做出貢獻
          </p>
        </div>

        <LocalModeIndicator />
        <ErrorBanner
          error={error}
          showLocalModeMessage={true}
          onClose={() => setError(null)}
        />

        {purchaseResult && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <AlertDescription className="text-green-800 dark:text-green-200">
              <p className="font-medium">購買成功！</p>
              <p className="text-sm mt-1">
                購買 ID: {purchaseResult.purchase_id}
              </p>
              <p className="text-sm mt-1">
                總價: ${purchaseResult.total_cost} USD
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "credits"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <Leaf className="h-4 w-4 inline mr-2" />
            碳權項目
          </button>
          <button
            onClick={() => setActiveTab("orderbook")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "orderbook"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            訂單簿
          </button>
        </div>

        {/* Credits Tab */}
        {activeTab === "credits" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carbonCredits.map((credit) => (
              <Card
                key={credit.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getProjectTypeIcon(credit.type)}
                      <Badge className={getCreditTypeColor(credit.standard)}>
                        {credit.standard}
                      </Badge>
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${credit.price_per_credit}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{credit.name}</CardTitle>
                  <CardDescription>位置: {credit.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>年份:</span>
                      <span className="font-medium">{credit.vintage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>可用數量:</span>
                      <span className="font-medium">
                        {credit.available_credits} 噸
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${credit.id}`}>購買數量</Label>
                      <Input
                        id={`quantity-${credit.id}`}
                        type="number"
                        min="1"
                        max={credit.available_credits}
                        value={purchaseQuantity}
                        onChange={(e) =>
                          setPurchaseQuantity(Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    <Button
                      onClick={() => handlePurchase(credit.id)}
                      disabled={
                        purchasing ||
                        purchaseQuantity > credit.available_credits
                      }
                      className="w-full"
                    >
                      {purchasing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      購買 $
                      {(credit.price_per_credit * purchaseQuantity).toFixed(2)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Orderbook Tab */}
        {activeTab === "orderbook" && (
          <div className="space-y-6">
            {orderBookLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : orderBook ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Buy Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mr-2">
                        買入訂單
                      </Badge>
                      <span className="text-sm text-gray-500">
                        ({orderBook.total_buy_orders} 筆)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {orderBook.buy_orders.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {orderBook.buy_orders.map(renderOrderBookEntry)}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        目前沒有買入訂單
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sell Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2">
                        賣出訂單
                      </Badge>
                      <span className="text-sm text-gray-500">
                        ({orderBook.total_sell_orders} 筆)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {orderBook.sell_orders.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {orderBook.sell_orders.map(renderOrderBookEntry)}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        目前沒有賣出訂單
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  無法載入訂單簿數據
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "credits" && carbonCredits.length === 0 && !error && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              目前沒有可用的碳權
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
