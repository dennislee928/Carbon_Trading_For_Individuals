"use client";

import React, { useState, useEffect } from "react";
import {
  carbonApi,
  CarbonCredit,
  CarbonOffsetPurchase,
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
import { Loader2, ShoppingCart, Leaf, TrendingUp } from "lucide-react";
import ErrorBanner from "../../components/ErrorBanner";
import LocalModeIndicator from "../../components/LocalModeIndicator";

export default function MarketPage() {
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] =
    useState<CarbonOffsetPurchase | null>(null);

  useEffect(() => {
    fetchCarbonCredits();
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

  const handlePurchase = async (creditId: string) => {
    try {
      setPurchasing(true);
      const result = await carbonApi.purchaseCarbonOffset(purchaseQuantity);
      setPurchaseResult(result);
      // 重新獲取碳權列表
      await fetchCarbonCredits();
    } catch (err) {
      console.error("購買失敗:", err);
      setError("購買失敗，請稍後再試");
    } finally {
      setPurchasing(false);
    }
  };

  const getCreditTypeColor = (type: string) => {
    switch (type) {
      case "VER":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "CER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getProjectTypeIcon = (type: string) => {
    if (type.includes("森林") || type.includes("Forestry")) {
      return <Leaf className="h-4 w-4" />;
    }
    if (type.includes("能源") || type.includes("Energy")) {
      return <TrendingUp className="h-4 w-4" />;
    }
    return <Leaf className="h-4 w-4" />;
  };

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
                交易 ID: {purchaseResult.transaction_id}
              </p>
              <p className="text-sm mt-1">
                總價: ${purchaseResult.final_price_usd} USD
              </p>
              <p className="text-sm mt-1">
                抵消等效: {purchaseResult.offset_equivalent.car_km} 公里汽車行駛
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carbonCredits.map((credit) => (
            <Card key={credit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getProjectTypeIcon(credit.project_type)}
                    <Badge className={getCreditTypeColor(credit.credit_type)}>
                      {credit.credit_type}
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${credit.price}
                  </span>
                </div>
                <CardTitle className="text-lg">{credit.project_type}</CardTitle>
                <CardDescription>
                  發行者: {credit.issuer} | 來源: {credit.origin}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>年份:</span>
                    <span className="font-medium">{credit.vintage_year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>可用數量:</span>
                    <span className="font-medium">{credit.quantity} 噸</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`quantity-${credit.id}`}>購買數量</Label>
                    <Input
                      id={`quantity-${credit.id}`}
                      type="number"
                      min="1"
                      max={credit.quantity}
                      value={purchaseQuantity}
                      onChange={(e) =>
                        setPurchaseQuantity(Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <Button
                    onClick={() => handlePurchase(credit.id)}
                    disabled={purchasing || purchaseQuantity > credit.quantity}
                    className="w-full"
                  >
                    {purchasing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    購買 ${(credit.price * purchaseQuantity).toFixed(2)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {carbonCredits.length === 0 && !error && (
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
