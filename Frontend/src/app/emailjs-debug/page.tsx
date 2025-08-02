"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import EmailJSService from "../../services/emailjs";

export default function EmailJSDebugPage() {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const status = EmailJSService.getConfigStatus();
    setConfigStatus(status);
  }, []);

  const handleTestEmail = async () => {
    if (!testEmail) {
      setTestResult({ success: false, message: "請輸入測試郵箱地址" });
      return;
    }

    setLoading(true);
    setTestResult(null);

    try {
      await EmailJSService.sendOTPEmail({
        to_email: testEmail,
        user_name: "測試用戶",
        otp_code: "123456",
      });

      setTestResult({
        success: true,
        message: "測試郵件發送成功！請檢查您的郵箱。",
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || "發送失敗",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          EmailJS 設定調試
        </h1>

        {/* 配置狀態 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>EmailJS 配置狀態</CardTitle>
            <CardDescription>檢查您的 EmailJS 環境變數設定</CardDescription>
          </CardHeader>
          <CardContent>
            {configStatus && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Service ID:</span>
                  <span
                    className={
                      configStatus.serviceId
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {configStatus.serviceId ? "已設定" : "未設定"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Template ID:</span>
                  <span
                    className={
                      configStatus.templateId
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {configStatus.templateId ? "已設定" : "未設定"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Public Key:</span>
                  <span
                    className={
                      configStatus.publicKey
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {configStatus.publicKey ? "已設定" : "未設定"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>整體配置:</span>
                  <span
                    className={
                      configStatus.isComplete
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {configStatus.isComplete ? "完整" : "不完整"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 測試郵件發送 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>測試郵件發送</CardTitle>
            <CardDescription>測試 EmailJS 郵件發送功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testEmail">測試郵箱地址</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="輸入您的郵箱地址"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={handleTestEmail}
                disabled={loading || !configStatus?.isComplete}
              >
                {loading ? "發送中..." : "發送測試郵件"}
              </Button>

              {testResult && (
                <Alert
                  className={
                    testResult.success
                      ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                      : "border-red-200 bg-red-50 dark:bg-red-900/20"
                  }
                >
                  <AlertDescription
                    className={
                      testResult.success
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }
                  >
                    {testResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 故障排除指南 */}
        <Card>
          <CardHeader>
            <CardTitle>故障排除指南</CardTitle>
            <CardDescription>常見問題和解決方案</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  1. "The recipients address is empty" 錯誤
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  這個錯誤通常表示 EmailJS
                  模板中沒有正確設定收件人欄位。請檢查：
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4 list-disc">
                  <li>EmailJS 模板中是否包含收件人欄位</li>
                  <li>模板參數名稱是否正確（通常是 to_email 或 to_name）</li>
                  <li>模板設定中是否啟用了動態收件人功能</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. 環境變數設定</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  確保在{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                    .env.local
                  </code>{" "}
                  文件中正確設定：
                </p>
                <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
                  {`NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. EmailJS 模板設定</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  在 EmailJS 控制台中，確保您的模板包含以下變數：
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4 list-disc">
                  <li>
                    <code>{{ to_email }}</code> - 收件人郵箱
                  </li>
                  <li>
                    <code>{{ user_name }}</code> - 用戶名稱
                  </li>
                  <li>
                    <code>{{ otp_code }}</code> - OTP 驗證碼
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
