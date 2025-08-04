"use client";

import { useState } from "react";
import { signInSolana } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function SolanaTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSolanaLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const result = await signInSolana();
      setSuccess("Solana 錢包登入成功！");
      console.log("登入結果:", result);
    } catch (err) {
      console.error("Solana 登入失敗:", err);
      setError(err instanceof Error ? err.message : "Solana 登入失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Solana 錢包登入測試
            </CardTitle>
            <CardDescription>
              測試免費方案的 Solana 錢包登入功能（使用 Edge Function）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSolanaLogin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "登入中..." : "使用 Solana Wallet 登入"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用說明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">1. 安裝 Phantom 錢包</p>
                <p className="text-muted-foreground">
                  請確保您已安裝 Phantom 錢包擴展
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">2. 解鎖錢包</p>
                <p className="text-muted-foreground">
                  確保您的錢包已解鎖並連接到正確的網路
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">3. 授權登入</p>
                <p className="text-muted-foreground">
                  點擊登入按鈕後，您的錢包會要求您簽署訊息以完成身份驗證
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>技術說明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">登入流程：</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>連接 Phantom 錢包</li>
                <li>獲取錢包公鑰</li>
                <li>簽署固定訊息："請簽署此訊息以登入我們的應用程式。"</li>
                <li>呼叫 Edge Function 進行簽名驗證</li>
                <li>Edge Function 驗證簽名並創建/獲取用戶</li>
                <li>生成 JWT token 並設定 session</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-green-600">優勢：</p>
              <p className="text-muted-foreground">
                此方法完全免費，使用 Supabase Edge Function 進行簽名驗證，
                不需要付費的 Authentication Hooks 功能。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
