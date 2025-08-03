"use client";

import { useState } from "react";
import { carbonTradingApi, SignupRequest } from "../../services/carbonApi";

export default function RegisterTest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    try {
      const testData: SignupRequest = {
        email: "test@example.com",
        password: "testpassword123",
      };

      console.log("測試註冊數據:", testData);
      const response = await carbonTradingApi.register(testData);
      console.log("註冊響應:", response);
      setResult(`註冊成功: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error("註冊錯誤:", error);
      setResult(
        `註冊失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">註冊功能測試</h1>
      <button
        onClick={testRegister}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "測試中..." : "測試註冊"}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
