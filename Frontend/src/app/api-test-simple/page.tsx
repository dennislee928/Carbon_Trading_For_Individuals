"use client";

import { useState } from "react";
import carbonTradingApi from "../../services/carbonApi";

export default function ApiTestSimple() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await carbonTradingApi.checkHealth();
      setResult(`健康檢查成功: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(
        `健康檢查失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const testData = {
        email: "test@example.com",
        password: "testpassword123",
      };
      const response = await carbonTradingApi.register(testData);
      setResult(`註冊測試成功: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(
        `註冊測試失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API 測試</h1>
      <div className="space-y-4">
        <button
          onClick={testHealth}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          測試健康檢查
        </button>
        <button
          onClick={testRegister}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          測試註冊
        </button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
