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
import { carbonApi, LoginRequest } from "../../services/carbonApi";

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

  useEffect(() => {
    // 頁面載入時檢查API狀態
    const checkApiOnLoad = async () => {
      const healthResult = await carbonApi.checkHealth();
      setApiStatus(
        healthResult.message ||
          (healthResult.status === "ok" ? "API正常運行中" : "API可能不穩定")
      );
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    // 首先檢查API是否可用
    const healthResult = await carbonApi.checkHealth();
    if (healthResult.status !== "ok") {
      setIsLoading(false);
      setErrors({
        form: healthResult.message || "API服務不可用，請稍後再試",
      });
      return;
    }

    try {
      console.log("嘗試登入:", formData);
      const response = await carbonApi.login(formData);
      console.log("登入響應:", response);

      if (response && response.token) {
        // 登入成功，跳轉到儀表板
        router.push("/dashboard");
      } else {
        setErrors({
          form: "登入失敗：無效的回應格式",
        });
      }
    } catch (err) {
      console.error("登入錯誤:", err);
      if (err instanceof Error) {
        setErrors({
          form: err.message,
        });
      } else {
        setErrors({
          form: "登入時發生未知錯誤",
        });
      }
    } finally {
      setIsLoading(false);
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
