"use client";

import {
  signInOAuth,
  signInSolana,
  isSupabaseConfigured,
} from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Github, LucideIcon, Wallet, Globe, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SignInButtonProps {
  label: string;
  Icon: LucideIcon | React.ComponentType<any>;
  onClick: () => void;
  disabled?: boolean;
}

const SignInButton = ({
  label,
  Icon,
  onClick,
  disabled,
}: SignInButtonProps) => (
  <Button
    className="w-full justify-start gap-2"
    variant="outline"
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);

export default function SignInButtons() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (provider: "github" | "google" | "solana") => {
    try {
      setError(null);
      setIsLoading(true);

      if (!isSupabaseConfigured) {
        setError("Supabase 環境變數未設定。請聯繫管理員配置登入功能。");
        return;
      }

      let result;
      if (provider === "solana") {
        result = await signInSolana();
      } else {
        result = await signInOAuth(provider);
      }

      // 登入成功後重定向到 dashboard
      console.log(`${provider} 登入流程完成`);
      // 對於 Solana 登入，如果沒有拋出錯誤，表示登入成功
      if (provider === "solana") {
        console.log("Solana 登入成功，重定向到 dashboard");
        router.push("/dashboard");
      }
      // 對於 OAuth 登入，會自動重定向，不需要手動處理
    } catch (err) {
      console.error("登入失敗:", err);
      setError(err instanceof Error ? err.message : "登入失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <SignInButton
          label="使用 GitHub 登入"
          Icon={Github}
          onClick={() => handleSignIn("github")}
          disabled={!isSupabaseConfigured || isLoading}
        />
        <SignInButton
          label="使用 Google 登入"
          Icon={Globe}
          onClick={() => handleSignIn("google")}
          disabled={!isSupabaseConfigured || isLoading}
        />
        <SignInButton
          label={isLoading ? "登入中..." : "使用 Solana Wallet 登入"}
          Icon={Wallet}
          onClick={() => handleSignIn("solana")}
          disabled={!isSupabaseConfigured || isLoading}
        />
      </div>

      {!isSupabaseConfigured && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            登入功能需要 Supabase 配置。請聯繫管理員。
          </p>
        </div>
      )}
    </div>
  );
}
