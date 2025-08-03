"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/services/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export default function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectDebugInfo = async () => {
      const info: any = {};

      // 環境變數檢查
      info.envVars = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_KEY.substring(0, 20)}...`
          : null,
        isConfigured: isSupabaseConfigured,
      };

      // 當前 URL 資訊
      info.currentUrl = {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      };

      // URL 參數
      const urlParams = new URLSearchParams(window.location.search);
      info.urlParams = {};
      for (const [key, value] of urlParams.entries()) {
        info.urlParams[key] = value;
      }

      // Supabase 會話檢查
      if (isSupabaseConfigured) {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          info.session = {
            exists: !!session,
            user: session?.user
              ? {
                  id: session.user.id,
                  email: session.user.email,
                  created_at: session.user.created_at,
                }
              : null,
            error: error?.message,
          };
        } catch (err) {
          info.session = {
            error: err instanceof Error ? err.message : "未知錯誤",
          };
        }
      }

      // 瀏覽器資訊
      info.browser = {
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
      };

      setDebugInfo(info);
      setLoading(false);
    };

    collectDebugInfo();
  }, []);

  const testOAuthFlow = async (provider: "github" | "google") => {
    try {
      console.log(`開始測試 ${provider} OAuth 流程...`);

      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log(`重定向 URL: ${redirectUrl}`);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(`${provider} OAuth 錯誤:`, error);
        alert(`${provider} OAuth 錯誤: ${error.message}`);
      } else {
        console.log(`${provider} OAuth 成功:`, data);
        alert(`${provider} OAuth 成功，請檢查重定向`);
      }
    } catch (err) {
      console.error(`${provider} 測試失敗:`, err);
      alert(
        `${provider} 測試失敗: ${
          err instanceof Error ? err.message : "未知錯誤"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>收集診斷資訊中...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              認證診斷資訊
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>環境變數狀態</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Supabase URL</h3>
                <div className="flex items-center gap-2">
                  {debugInfo.envVars?.supabaseUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {debugInfo.envVars?.supabaseUrl || "未設定"}
                  </code>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Supabase Key</h3>
                <div className="flex items-center gap-2">
                  {debugInfo.envVars?.supabaseKey ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {debugInfo.envVars?.supabaseKey || "未設定"}
                  </code>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">配置狀態</h3>
                <div className="flex items-center gap-2">
                  {debugInfo.envVars?.isConfigured ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      debugInfo.envVars?.isConfigured
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {debugInfo.envVars?.isConfigured ? "已配置" : "未配置"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>會話狀態</CardTitle>
          </CardHeader>
          <CardContent>
            {debugInfo.session?.exists ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">已登入</span>
                </div>
                <p>
                  <strong>用戶 ID:</strong> {debugInfo.session.user.id}
                </p>
                <p>
                  <strong>電子郵件:</strong> {debugInfo.session.user.email}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">未登入</span>
                </div>
                {debugInfo.session?.error && (
                  <p className="text-red-600">
                    錯誤: {debugInfo.session.error}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {debugInfo.envVars?.isConfigured && (
          <Card>
            <CardHeader>
              <CardTitle>OAuth 測試</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => testOAuthFlow("github")}
                  className="w-full"
                >
                  測試 GitHub OAuth
                </Button>
                <Button
                  onClick={() => testOAuthFlow("google")}
                  className="w-full"
                >
                  測試 Google OAuth
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                點擊按鈕測試 OAuth 流程。請打開瀏覽器開發者工具的 Console 和
                Network 標籤來監控請求。
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
