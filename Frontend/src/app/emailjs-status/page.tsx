"use client";

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
import { Badge } from "../../components/ui/badge";
import EmailJSService from "../../services/emailjs";

export default function EmailJSStatusPage() {
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [envVars, setEnvVars] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    // 獲取配置狀態
    const status = EmailJSService.getConfigStatus();
    setConfigStatus(status);

    // 檢查環境變數
    const env = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    };
    setEnvVars(env);

    console.log("EmailJS 配置狀態:", status);
    console.log("環境變數:", env);
  }, []);

  const runTest = async () => {
    setTestResult({ loading: true, message: "測試中..." });

    try {
      const result = await EmailJSService.testConnection();
      setTestResult({
        success: result,
        message: result ? "連接測試成功" : "連接測試失敗",
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `測試失敗: ${error.message}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          EmailJS 狀態檢查
        </h1>

        {/* 配置狀態 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>配置狀態</CardTitle>
            <CardDescription>檢查 EmailJS 的配置是否完整</CardDescription>
          </CardHeader>
          <CardContent>
            {configStatus && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>整體配置狀態:</span>
                  <Badge
                    variant={
                      configStatus.isComplete ? "default" : "destructive"
                    }
                  >
                    {configStatus.isComplete ? "完整" : "不完整"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Service ID:</span>
                    <Badge
                      variant={configStatus.serviceId ? "default" : "secondary"}
                    >
                      {configStatus.serviceId ? "已設定" : "未設定"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Template ID:</span>
                    <Badge
                      variant={
                        configStatus.templateId ? "default" : "secondary"
                      }
                    >
                      {configStatus.templateId ? "已設定" : "未設定"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Public Key:</span>
                    <Badge
                      variant={configStatus.publicKey ? "default" : "secondary"}
                    >
                      {configStatus.publicKey ? "已設定" : "未設定"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 環境變數檢查 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>環境變數檢查</CardTitle>
            <CardDescription>
              檢查 .env.local 文件中的環境變數設定
            </CardDescription>
          </CardHeader>
          <CardContent>
            {envVars && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded">
                    <div className="font-semibold mb-2">Service ID</div>
                    <div className="text-sm break-all">
                      {envVars.serviceId || "未設定"}
                      {envVars.serviceId === "your_service_id_here" && (
                        <div className="text-red-500 mt-1">
                          ⚠️ 需要填入實際值
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="font-semibold mb-2">Template ID</div>
                    <div className="text-sm break-all">
                      {envVars.templateId || "未設定"}
                      {envVars.templateId === "your_template_id_here" && (
                        <div className="text-red-500 mt-1">
                          ⚠️ 需要填入實際值
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="font-semibold mb-2">Public Key</div>
                    <div className="text-sm break-all">
                      {envVars.publicKey || "未設定"}
                      {envVars.publicKey === "your_public_key_here" && (
                        <div className="text-red-500 mt-1">
                          ⚠️ 需要填入實際值
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 測試連接 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>連接測試</CardTitle>
            <CardDescription>測試 EmailJS 連接是否正常</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={runTest}
                disabled={!configStatus?.isComplete || testResult?.loading}
              >
                {testResult?.loading ? "測試中..." : "測試連接"}
              </Button>

              {testResult && !testResult.loading && (
                <Alert variant={testResult.success ? "default" : "destructive"}>
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 問題診斷 */}
        <Card>
          <CardHeader>
            <CardTitle>問題診斷</CardTitle>
            <CardDescription>根據當前狀態提供的解決方案</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!configStatus?.isComplete && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>配置不完整</strong>
                    <br />
                    您需要：
                    <ul className="list-disc list-inside mt-2">
                      {!configStatus?.serviceId && (
                        <li>設定 NEXT_PUBLIC_EMAILJS_SERVICE_ID</li>
                      )}
                      {!configStatus?.templateId && (
                        <li>設定 NEXT_PUBLIC_EMAILJS_TEMPLATE_ID</li>
                      )}
                      {!configStatus?.publicKey && (
                        <li>設定 NEXT_PUBLIC_EMAILJS_PUBLIC_KEY</li>
                      )}
                    </ul>
                    <br />
                    請編輯{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      Frontend/.env.local
                    </code>{" "}
                    文件
                  </AlertDescription>
                </Alert>
              )}

              {envVars?.serviceId === "your_service_id_here" && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>環境變數未更新</strong>
                    <br />
                    您的 .env.local 文件還包含預設值，需要填入實際的 EmailJS
                    配置信息。
                    <br />
                    請參考{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      Frontend/EMAILJS_FIX.md
                    </code>{" "}
                    文件
                  </AlertDescription>
                </Alert>
              )}

              {configStatus?.isComplete && (
                <Alert>
                  <AlertDescription>
                    <strong>配置完整</strong>
                    <br />
                    您的 EmailJS 配置看起來是完整的。如果仍然無法發送郵件，請：
                    <ul className="list-disc list-inside mt-2">
                      <li>檢查 EmailJS 模板設定</li>
                      <li>確認郵件服務商設定</li>
                      <li>查看瀏覽器控制台的錯誤信息</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
