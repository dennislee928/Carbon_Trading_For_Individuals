"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { carbonApi, SignupRequest } from "@/app/services/carbonApi";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<
    SignupRequest & { confirmPassword: string }
  >({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

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
      confirmPassword?: string;
    } = {};

    if (!formData.email) {
      newErrors.email = "請輸入電子郵件";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件地址";
    }

    if (!formData.password) {
      newErrors.password = "請輸入密碼";
    } else if (formData.password.length < 8) {
      newErrors.password = "密碼必須至少包含8個字符";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "請確認密碼";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "兩次密碼輸入不一致";
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

    try {
      // 從formData中排除confirmPassword
      const { confirmPassword, ...signupData } = formData;
      const response = await carbonApi.register(signupData);
      setSuccess(true);
      // 註冊成功後延遲導航至登入頁面
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({
          form: err.message,
        });
      } else {
        setErrors({
          form: "註冊時發生未知錯誤",
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
            建立您的碳交易平台帳戶
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>註冊帳戶</CardTitle>
            <CardDescription>填寫以下資訊以創建新帳戶</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <AlertDescription>
                  註冊成功！正在將您重定向至登入頁面...
                </AlertDescription>
              </Alert>
            ) : (
              <>
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
                    <Label htmlFor="password">密碼</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="請設置您的密碼"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">確認密碼</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="請再次輸入密碼"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "註冊中..." : "註冊"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              已有帳戶？{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-700 hover:underline"
              >
                立即登入
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
