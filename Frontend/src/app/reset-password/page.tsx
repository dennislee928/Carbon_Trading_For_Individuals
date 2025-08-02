"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ThemeToggle } from "@/app/components/theme-toggle";

function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // 驗證 token 是否有效
    if (!token || !email) {
      setError("無效的重置連結");
      return;
    }

    // 這裡應該調用後端 API 來驗證 token
    // 目前使用模擬驗證
    setIsValidToken(true);
  }, [token, email]);

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("請填寫所有欄位");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("密碼不匹配");
      return;
    }

    if (newPassword.length < 6) {
      setError("密碼至少需要 6 個字符");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 這裡應該調用後端 API 來重置密碼
      console.log("重置密碼:", {
        token,
        email,
        newPassword,
      });

      setSuccess("密碼重置成功！請使用新密碼登入");

      // 3秒後跳轉到登入頁面
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("重置密碼失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link
              href="/"
              className="text-3xl font-bold text-green-600 dark:text-green-400"
            >
              碳交易平台
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              無效的重置連結
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              此重置連結已過期或無效
            </p>
          </div>

          <Card>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  此重置連結已過期或無效。請重新申請密碼重置。
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-2">
                <Link href="/forgot-password">
                  <Button className="w-full">重新申請密碼重置</Button>
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  返回登入頁面
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="text-3xl font-bold text-green-600 dark:text-green-400"
          >
            碳交易平台
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            重置密碼
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            請為帳戶 {email} 設定新密碼
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>設定新密碼</CardTitle>
            <CardDescription>
              請輸入您的新密碼，密碼至少需要 6 個字符
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="newPassword">新密碼</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="請輸入新密碼"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="請再次輸入新密碼"
                required
              />
            </div>

            <Button
              onClick={resetPassword}
              disabled={loading}
              className="w-full"
            >
              {loading ? "重置中..." : "重置密碼"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                返回登入頁面
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 導出包裝了Suspense的組件
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}