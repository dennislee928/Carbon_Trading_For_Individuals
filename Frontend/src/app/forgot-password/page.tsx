"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import EmailJSService from "../../services/emailjs";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // 檢查 EmailJS 配置
  const isEmailJSConfigured = EmailJSService.validateConfig();

  const sendOTP = async () => {
    if (!email) {
      setError("請輸入電子郵件地址");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const otpCode = EmailJSService.generateOTP();

      // 儲存 OTP 到 localStorage (在實際應用中應該儲存到後端)
      localStorage.setItem("resetOTP", otpCode);
      localStorage.setItem("resetEmail", email);

      // 使用 EmailJS 發送 OTP
      const templateParams = {
        to_email: email,
        otp_code: otpCode,
        user_name: email.split("@")[0], // 簡單的用戶名提取
      };

      await EmailJSService.sendOTPEmail(templateParams);

      setOtpSent(true);
      if (!isEmailJSConfigured) {
        setSuccess("OTP 已生成（模擬模式）。請檢查瀏覽器控制台查看 OTP 驗證碼");
      } else {
        setSuccess("OTP 已發送到您的電子郵件地址");
      }
      setStep("otp");
    } catch (err) {
      console.error("發送 OTP 失敗:", err);
      setError("發送 OTP 失敗，請檢查您的電子郵件地址或稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError("請輸入 OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedOTP = localStorage.getItem("resetOTP");
      const storedEmail = localStorage.getItem("resetEmail");

      if (!storedOTP || !storedEmail) {
        setError("OTP 已過期，請重新發送");
        setStep("email");
        return;
      }

      if (otp === storedOTP) {
        setSuccess("OTP 驗證成功");
        setStep("newPassword");
      } else {
        setError("OTP 不正確，請重新輸入");
      }
    } catch (err) {
      setError("驗證 OTP 時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

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
      const storedEmail = localStorage.getItem("resetEmail");

      // 這裡應該調用後端 API 來重置密碼
      // 目前使用模擬 API 調用
      console.log("重置密碼:", {
        email: storedEmail,
        newPassword: newPassword,
      });

      // 清除儲存的 OTP 和郵箱
      localStorage.removeItem("resetOTP");
      localStorage.removeItem("resetEmail");

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

  const resendOTP = () => {
    setOtp("");
    setError(null);
    sendOTP();
  };

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
            忘記密碼
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            請輸入您的電子郵件地址以重置密碼
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === "email" && "發送重置連結"}
              {step === "otp" && "驗證 OTP"}
              {step === "newPassword" && "設定新密碼"}
            </CardTitle>
            <CardDescription>
              {step === "email" && "我們將向您的電子郵件發送 OTP 驗證碼"}
              {step === "otp" && "請輸入發送到您電子郵件的 6 位數驗證碼"}
              {step === "newPassword" && "請設定您的新密碼"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEmailJSConfigured && (
              <Alert variant="destructive">
                <AlertDescription>
                  EmailJS 未配置，無法發送郵件。請聯繫管理員配置 EmailJS 服務。
                </AlertDescription>
              </Alert>
            )}

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

            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">電子郵件地址</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="請輸入您的電子郵件地址"
                    required
                  />
                </div>
                <Button
                  onClick={sendOTP}
                  disabled={loading || !isEmailJSConfigured}
                  className="w-full"
                >
                  {loading ? "發送中..." : "發送 OTP"}
                </Button>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">OTP 驗證碼</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="請輸入 6 位數驗證碼"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={verifyOTP}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "驗證中..." : "驗證 OTP"}
                  </Button>
                  <Button
                    onClick={resendOTP}
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    重新發送
                  </Button>
                </div>
              </div>
            )}

            {step === "newPassword" && (
              <div className="space-y-4">
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
              </div>
            )}

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
