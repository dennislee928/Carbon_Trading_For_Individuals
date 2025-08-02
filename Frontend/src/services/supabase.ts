import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient>;

if (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_KEY
) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );
} else {
  // 在靜態生成 / 构建階段缺少環境變數時，提供臨時空殼，避免拋例外
  supabase = {
    auth: {
      signInWithOAuth: async () => {
        throw new Error("Supabase env vars not set");
      },
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      getSession: async () => ({ data: { session: null } }),
    },
  } as any;
}

export { supabase };

export const signInOAuth = async (provider: "github" | "google") => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
};

export const signInSolana = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "solana",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
};
