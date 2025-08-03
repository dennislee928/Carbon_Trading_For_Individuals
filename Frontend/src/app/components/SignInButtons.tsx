"use client";

import { signInOAuth, signInSolana, isSupabaseConfigured } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Github, LucideIcon, Wallet, Globe, AlertCircle } from "lucide-react";
import { useState } from "react";

interface SignInButtonProps {
  label: string;
  Icon: LucideIcon | React.ComponentType<any>;
  onClick: () => void;
  disabled?: boolean;
}

const SignInButton = ({ label, Icon, onClick, disabled }: SignInButtonProps) => (
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

  const handleSignIn = async (provider: "github" | "google" | "solana") => {
    try {
      setError(null);
      
      if (!isSupabaseConfigured) {
        setError("Supabase 環境變數未設定。請聯繫管理員配置登入功能。");
        return;
      }

      if (provider === "solana") {
        await signInSolana();
      } else {
        await signInOAuth(provider);
      }
    } catch (err) {
      console.error("登入失敗:", err);
      setError(err instanceof Error ? err.message : "登入失敗，請稍後再試");
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
          disabled={!isSupabaseConfigured}
        />
        <SignInButton
          label="使用 Google 登入"
          Icon={Globe}
          onClick={() => handleSignIn("google")}
          disabled={!isSupabaseConfigured}
        />
        <SignInButton
          label="使用 Solana Wallet 登入"
          Icon={Wallet}
          onClick={() => handleSignIn("solana")}
          disabled={!isSupabaseConfigured}
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
