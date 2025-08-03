"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { carbonApi } from "../services/carbonApi";

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoints = [
    {
      name: "登入",
      test: async () => {
        const result = await carbonApi.login({
          email: "pcleegood@gmail.com",
          password: "Popoman1217!",
        });
        localStorage.setItem("token", result.token);
        return result;
      },
    },
    {
      name: "登出",
      test: async () => {
        await carbonApi.logout();
        return { message: "登出成功" };
      },
    },
    {
      name: "認證檢查 (新)",
      test: async () => {
        const result = await carbonApi.getCurrentUser();
        return result;
      },
    },
    {
      name: "用戶資產 (新)",
      test: async () => {
        const result = await carbonApi.getUserAssets(
          "35052e25-9076-4acc-852f-50714437f974"
        );
        return result;
      },
    },
    {
      name: "計算碳足跡",
      test: async () => {
        const result = await carbonApi.calculateCarbonFootprint({
          activity_type: "transport",
          quantity: 100,
          unit: "km",
          country_code: "tw",
        });
        return result;
      },
    },
    {
      name: "獲取碳市場統計",
      test: async () => {
        const result = await carbonApi.getCarbonMarketStats();
        return result;
      },
    },
    {
      name: "獲取碳權項目列表",
      test: async () => {
        const result = await carbonApi.getCarbonCredits();
        return result;
      },
    },
    {
      name: "獲取碳權項目詳情 (proj-001)",
      test: async () => {
        const result = await carbonApi.getCarbonCreditById("proj-001");
        return result;
      },
    },
    {
      name: "獲取碳權代幣列表",
      test: async () => {
        const result = await carbonApi.getCarbonTokens();
        return result;
      },
    },
    {
      name: "模擬碳權抵消購買",
      test: async () => {
        const result = await carbonApi.purchaseCarbonOffset({
          credit_id: "990e8400-e29b-41d4-a716-446655440004",
          quantity: 1,
        });
        return result;
      },
    },
    {
      name: "模擬碳權抵消",
      test: async () => {
        const result = await carbonApi.simulateCarbonOffset({
          activity_type: "transport",
          quantity: 100,
          unit: "km",
          country_code: "tw",
        });
        return result;
      },
    },
    {
      name: "獲取訂單簿",
      test: async () => {
        const result = await carbonApi.getOrderBook();
        return result;
      },
    },
    {
      name: "創建交易報價",
      test: async () => {
        const result = await carbonApi.createTradeOffer({
          order_type: "sell",
          credit_type: "VCS",
          vintage_year: 2022,
          project_type: "forestry",
          quantity: 1,
          price: 25,
        });
        return result;
      },
    },
    {
      name: "通知列表 (新)",
      test: async () => {
        const result = await carbonApi.getNotifications();
        return result;
      },
    },
    {
      name: "統計概覽 (新)",
      test: async () => {
        const result = await carbonApi.getStatsOverview();
        return result;
      },
    },
    {
      name: "交易統計 (新)",
      test: async () => {
        const result = await carbonApi.getTradeStats();
        return result;
      },
    },
    {
      name: "用戶統計 (新)",
      test: async () => {
        const result = await carbonApi.getUserStats();
        return result;
      },
    },
    {
      name: "創建交易",
      test: async () => {
        const result = await carbonApi.createTrade({
          credit_type: "VCS",
          vintage_year: 2022,
          project_type: "forestry",
          quantity: 1,
          price: 25,
        });
        return result;
      },
    },
    {
      name: "獲取交易訂單",
      test: async () => {
        const result = await carbonApi.getUserTradeOrders(
          "35052e25-9076-4acc-852f-50714437f974"
        );
        return result;
      },
    },
  ];

  const runTest = async (endpoint: (typeof testEndpoints)[0]) => {
    setLoading(endpoint.name);
    try {
      const result = await endpoint.test();
      setResults((prev: any) => ({
        ...prev,
        [endpoint.name]: { success: true, data: result },
      }));
    } catch (error) {
      setResults((prev: any) => ({
        ...prev,
        [endpoint.name]: { success: false, error: error },
      }));
    } finally {
      setLoading(null);
    }
  };

  const runAllTests = async () => {
    setLoading("所有測試");
    const newResults: any = {};

    for (const endpoint of testEndpoints) {
      try {
        const result = await endpoint.test();
        newResults[endpoint.name] = { success: true, data: result };
      } catch (error) {
        newResults[endpoint.name] = { success: false, error: error };
      }
    }

    setResults(newResults);
    setLoading(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API 測試頁面</h1>

      <div className="mb-6">
        <Button onClick={runAllTests} disabled={loading === "所有測試"}>
          {loading === "所有測試" ? "測試中..." : "運行所有測試"}
        </Button>
      </div>

      <div className="grid gap-4">
        {testEndpoints.map((endpoint) => (
          <Card key={endpoint.name}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{endpoint.name}</span>
                <Button
                  onClick={() => runTest(endpoint)}
                  disabled={loading === endpoint.name}
                  size="sm"
                >
                  {loading === endpoint.name ? "測試中..." : "測試"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results[endpoint.name] && (
                <div className="mt-4">
                  {results[endpoint.name].success ? (
                    <div className="text-green-600">
                      <strong>成功</strong>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(results[endpoint.name].data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <strong>失敗</strong>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                        {JSON.stringify(results[endpoint.name].error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
