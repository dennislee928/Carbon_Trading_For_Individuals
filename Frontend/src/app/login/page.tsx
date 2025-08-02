"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import carbonApi, { LoginRequest } from "../services/carbonApi";
import { AuthProvider } from "../components/AuthProvider";
//
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    // 頁面載入時檢查API狀態
    const checkApiOnLoad = async () => {
      try {
        console.log("正在檢查API健康狀態...");
        // 簡單的健康檢查，測試基本 URL 是否可訪問
        const baseUrl = "https://apiv1-carbontrading.dennisleehappy.org";
        const res = await fetch(`${baseUrl}/api/v1/health`, { mode: 'no-cors' });
        console.log("API健康檢查狀態:", res.status);
        
        setApiStatus("API可訪問");
      } catch (error) {
        console.error("API健康檢查錯誤:", error);
        setApiStatus("無法連接到API服務");
      }
    };

    checkApiOnLoad();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 清除該字段的錯誤
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!formData.email) {
      newErrors.email = "請輸入電子郵件";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件地址";
    }

    if (!formData.password) {
      newErrors.password = "請輸入密碼";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("表單已提交");
    setDebugInfo("表單已提交");

    if (!validateForm()) {
      console.log("表單驗證失敗");
      setDebugInfo("表單驗證失敗");
      return;
    }

    setIsLoading(true);
    setErrors({});
    setDebugInfo("驗證通過，準備登入...");

    try {
      console.log("嘗試登入:", formData);
      setDebugInfo("正在發送登入請求...");

      // 直接發送登入請求，不再預先檢查API健康狀態
      const response = await carbonApi.login(formData);

      console.log("登入響應:", response);
      setDebugInfo(`登入響應: ${JSON.stringify(response)}`);

      if (response && response.token) {
        // 登入成功，儲存token
        localStorage.setItem("token", response.token);

        // 嘗試解析JWT獲取用戶ID
        try {
          const payload = response.token.split(".")[1];
          const decodedData = JSON.parse(atob(payload));
          if (decodedData.user_id) {
            localStorage.setItem("userId", decodedData.user_id);
            console.log("已儲存用戶ID:", decodedData.user_id);
          }
        } catch (parseError) {
          console.error("無法解析JWT:", parseError);
        }

        // 登入成功，跳轉到儀表板
        setDebugInfo("登入成功，準備跳轉...");
        router.push("/dashboard");
      } else {
        setErrors({
          form: "登入失敗：無效的回應格式",
        });
        setDebugInfo("登入失敗：無效的回應格式");
      }
    } catch (err) {
      console.error("登入錯誤:", err);
      setDebugInfo(
        `登入錯誤: ${err instanceof Error ? err.message : String(err)}`
      );

      if (err instanceof Error) {
        // 提供更友好的錯誤訊息
        if (
          err.message.includes("Network Error") ||
          err.message.includes("CORS")
        ) {
          setErrors({
            form: "無法連接到伺服器，可能是網絡問題或CORS設定錯誤",
          });
        } else if (err.message.includes("404")) {
          setErrors({
            form: "API端點不存在，請檢查後端設定",
          });
        } else if (err.message.includes("401")) {
          setErrors({
            form: "帳號或密碼不正確",
          });
        } else {
          setErrors({
            form: err.message,
          });
        }
      } else {
        setErrors({
          form: "登入時發生未知錯誤",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 手動測試API連接按鈕
  const testApiConnection = async () => {
    setDebugInfo("測試API連接...");
    try {
      const baseUrl = "https://apiv1-carbontrading.dennisleehappy.org";
      const healthResult = await fetch(`${baseUrl}/api/v1/health`, { mode: 'no-cors' });
      setDebugInfo(`API健康檢查結果: ${JSON.stringify(healthResult)}`);

      // 測試API基礎URL
      const baseUrlDisplay = "https://apiv1-carbontrading.dennisleehappy.org";
      setDebugInfo(`API基礎URL: ${baseUrlDisplay}`);
    } catch (error) {
      setDebugInfo(
        `API連接測試失敗: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">碳交易平台</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            歡迎回來！請登入您的帳戶
          </p>
          {apiStatus && (
            <p
              className={`mt-2 text-xs ${
                apiStatus.includes("正常")
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {apiStatus}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登入</CardTitle>
            <CardDescription>使用您的電子郵件和密碼登入</CardDescription>
          </CardHeader>
          <CardContent>
            {errors.form && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="請輸入您的電子郵件"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密碼</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    忘記密碼？
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="請輸入您的密碼"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "登入中..." : "登入"}
              </Button>
            </form>
            {/* 測試連接按鈕 */}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={testApiConnection}
                type="button"
              >
                測試API連接
              </Button>
            </div>

            {/* 調試信息 */}
            {debugInfo && (
              <div className="mt-4 border border-gray-200 rounded p-2 text-xs text-gray-500 bg-gray-50">
                <p className="font-bold">調試信息:</p>
                <p className="whitespace-pre-wrap">{debugInfo}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              還沒有帳戶？{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-700 hover:underline"
              >
                立即註冊
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-xs text-gray-500">
          若遇到登入問題，請確認API設定是否正確，或聯繫系統管理員
        </div>
      </div>
    </div>
  );
}
