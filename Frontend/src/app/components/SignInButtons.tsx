"use client";

import { signInOAuth, signInSolana } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { Github, LucideIcon, Wallet, Globe } from "lucide-react";

interface SignInButtonProps {
  label: string;
  Icon: LucideIcon | React.ComponentType<any>;
  onClick: () => void;
}

const SignInButton = ({ label, Icon, onClick }: SignInButtonProps) => (
  <Button
    className="w-full justify-start gap-2"
    variant="outline"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);

export default function SignInButtons() {
  return (
    <div className="space-y-2">
      <SignInButton
        label="使用 GitHub 登入"
        Icon={Github}
        onClick={() => signInOAuth("github")}
      />
      <SignInButton
        label="使用 Google 登入"
        Icon={Globe}
        onClick={() => signInOAuth("google")}
      />
      <SignInButton
        label="使用 Solana Wallet 登入"
        Icon={Wallet}
        onClick={() => signInSolana()}
      />
    </div>
  );
}
