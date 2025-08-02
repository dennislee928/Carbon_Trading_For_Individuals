"use client";

import { useState } from "react";
import { carbonTradingApi } from "@/services/carbonApi";

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testApi = async (apiName: string, apiCall: () => Promise<any>) => {
    setLoading(apiName);
    try {
      const result = await apiCall();
      setResults((prev) => ({
        ...prev,
        [apiName]: { success: true, data: result },
      }));
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        [apiName]: {
          success: false,
          error: error.message || "Unknown error",
        },
      }));
    } finally {
      setLoading(null);
    }
  };

  const testApis = {
    "Market Stats": () => carbonTradingApi.getMarketStats(),
    "Carbon Projects": () =>
      carbonTradingApi.getCarbonProjects({ page: 1, limit: 5 }),
    "Carbon Tokens": () =>
      carbonTradingApi.getCarbonTokens({ page: 1, limit: 5 }),
    "Order Book": () => carbonTradingApi.getOrderBook(),
    "Carbon Credits": () => carbonTradingApi.getCarbonCredits(),
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">碳交易 API 測試</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(testApis).map(([name, apiCall]) => (
          <button
            key={name}
            onClick={() => testApi(name, apiCall)}
            disabled={loading === name}
            className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {loading === name ? "測試中..." : `測試 ${name}`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{name}</h3>
            {result.success ? (
              <div className="bg-green-50 p-3 rounded">
                <p className="text-green-800 font-medium">成功</p>
                <pre className="text-sm mt-2 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded">
                <p className="text-red-800 font-medium">失敗</p>
                <p className="text-red-600">{result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
