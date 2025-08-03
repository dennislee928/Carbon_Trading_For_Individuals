"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("處理認證回調...");

        // 獲取當前會話
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("會話錯誤:", sessionError);
          setError(sessionError.message);
          setStatus("error");
          return;
        }

        if (session) {
          console.log("認證成功:", session.user.email);
          setUser(session.user);
          setStatus("success");

          // 延遲重定向，讓用戶看到成功訊息
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          console.log("沒有會話，檢查 URL 參數...");

          // 檢查 URL 參數
          const urlParams = new URLSearchParams(window.location.search);
          const errorParam = urlParams.get("error");
          const errorDescription = urlParams.get("error_description");

          if (errorParam) {
            console.error("認證錯誤:", errorParam, errorDescription);
            setError(errorDescription || errorParam);
            setStatus("error");
          } else {
            console.log("沒有錯誤參數，但也沒有會話");
            setError("認證過程未完成，請重試");
            setStatus("error");
          }
        }
      } catch (err) {
        console.error("認證回調處理失敗:", err);
        setError(err instanceof Error ? err.message : "未知錯誤");
        setStatus("error");
      }
    };

    handleAuthCallback();
  }, [router]);

  const handleRetry = () => {
    setStatus("loading");
    setError(null);
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              處理認證中...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              正在驗證您的登入資訊，請稍候...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              登入成功！
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              歡迎回來，{user?.email}！
            </p>
            <p className="text-sm text-gray-500">正在重定向到儀表板...</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              立即前往儀表板
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-red-600">
            <XCircle className="h-6 w-6 mr-2" />
            登入失敗
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {error || "認證過程中發生錯誤"}
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="w-full">
              重新登入
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              返回首頁
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
