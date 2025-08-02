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
      name: "認證檢查",
      test: async () => {
        const result = await carbonApi.getCurrentUser();
        return result;
      },
    },
    {
      name: "碳權列表",
      test: async () => {
        const result = await carbonApi.getCarbonCredits();
        return result;
      },
    },
    {
      name: "用戶資產",
      test: async () => {
        const result = await carbonApi.getUserAssets("user-123");
        return result;
      },
    },
    {
      name: "用戶交易歷史",
      test: async () => {
        const result = await carbonApi.getUserTradeHistory("user-123");
        return result;
      },
    },
    {
      name: "通知列表",
      test: async () => {
        const result = await carbonApi.getNotifications();
        return result;
      },
    },
    {
      name: "統計概覽",
      test: async () => {
        const result = await carbonApi.getStatsOverview();
        return result;
      },
    },
    {
      name: "交易統計",
      test: async () => {
        const result = await carbonApi.getTradeStats();
        return result;
      },
    },
    {
      name: "用戶統計",
      test: async () => {
        const result = await carbonApi.getUserStats();
        return result;
      },
    },
    {
      name: "碳權購買",
      test: async () => {
        const result = await carbonApi.purchaseCarbonOffset(10);
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
