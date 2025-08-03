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
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function SupabaseTest() {
  const [configStatus, setConfigStatus] = useState<{
    url: string;
    key: string;
    configured: boolean;
  }>({
    url: "",
    key: "",
    configured: false,
  });
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfig = async () => {
      setConfigStatus({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "未設定",
        key: process.env.NEXT_PUBLIC_SUPABASE_KEY 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_KEY.substring(0, 20)}...`
          : "未設定",
        configured: isSupabaseConfigured,
      });

      if (isSupabaseConfigured) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error("獲取會話錯誤:", error);
          } else {
            setSession(session);
          }
        } catch (err) {
          console.error("檢查會話失敗:", err);
        }
      }
      setLoading(false);
    };

    checkConfig();
  }, []);

  const testOAuth = async (provider: "github" | "google") => {
    try {
      console.log(`測試 ${provider} 登入...`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error(`${provider} 登入錯誤:`, error);
        alert(`${provider} 登入錯誤: ${error.message}`);
      } else {
        console.log(`${provider} 登入成功:`, data);
        alert(`${provider} 登入成功，請檢查重定向`);
      }
    } catch (err) {
      console.error(`${provider} 測試失敗:`, err);
      alert(`${provider} 測試失敗: ${err instanceof Error ? err.message : "未知錯誤"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>檢查 Supabase 配置中...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Supabase 配置檢查
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">URL 配置</h3>
                <div className="flex items-center gap-2">
                  {configStatus.url !== "未設定" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {configStatus.url}
                  </code>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key 配置</h3>
                <div className="flex items-center gap-2">
                  {configStatus.key !== "未設定" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {configStatus.key}
                  </code>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">整體配置狀態</h3>
              <div className="flex items-center gap-2">
                {configStatus.configured ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={configStatus.configured ? "text-green-600" : "text-red-600"}>
                  {configStatus.configured ? "配置正確" : "配置錯誤"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>當前會話狀態</CardTitle>
          </CardHeader>
          <CardContent>
            {session ? (
              <div className="space-y-2">
                <p><strong>用戶 ID:</strong> {session.user.id}</p>
                <p><strong>電子郵件:</strong> {session.user.email}</p>
                <p><strong>登入時間:</strong> {new Date(session.user.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-gray-600">未登入</p>
            )}
          </CardContent>
        </Card>

        {configStatus.configured && (
          <Card>
            <CardHeader>
              <CardTitle>OAuth 測試</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => testOAuth("github")} className="w-full">
                  測試 GitHub 登入
                </Button>
                <Button onClick={() => testOAuth("google")} className="w-full">
                  測試 Google 登入
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                點擊按鈕測試 OAuth 登入。如果配置正確，應該會重定向到對應的授權頁面。
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 