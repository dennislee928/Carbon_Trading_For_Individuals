import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient>;

// 檢查環境變數是否已設定
const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_KEY
);

if (isSupabaseConfigured) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  );
} else {
  // 在靜態生成 / 构建階段缺少環境變數時，提供臨時空殼，避免拋例外
  supabase = {
    auth: {
      signInWithOAuth: async () => {
        console.warn("Supabase 環境變數未設定，請檢查 .env.local 文件");
        throw new Error(
          "Supabase 環境變數未設定。請在 .env.local 文件中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_KEY"
        );
      },
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      getSession: async () => ({ data: { session: null } }),
    },
  } as any;
}

export { supabase, isSupabaseConfigured };

export const signInOAuth = async (provider: "github" | "google") => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase 環境變數未設定。請在 .env.local 文件中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_KEY"
    );
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
};

export const signInSolana = async () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase 環境變數未設定。請在 .env.local 文件中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_KEY"
    );
  }

  // 檢查是否支援 Solana 錢包
  if (!window.solana) {
    throw new Error("請安裝 Solana 錢包擴展（如 Phantom、Solflare 等）");
  }

  // 確保錢包已連接
  try {
    await window.solana.connect();
  } catch (error) {
    throw new Error("無法連接到 Solana 錢包，請檢查錢包設定");
  }

  const { data, error } = await supabase.auth.signInWithWeb3({
    chain: "solana",
    statement: "我同意碳交易平台的服務條款和隱私政策",
  });

  if (error) throw error;
  return data;
};
