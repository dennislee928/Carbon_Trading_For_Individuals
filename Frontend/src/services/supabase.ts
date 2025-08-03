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

  console.log(`開始 ${provider} 登入流程...`);
  console.log(`重定向 URL: ${window.location.origin}/auth/callback`);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error(`${provider} 登入錯誤:`, error);
    throw error;
  }

  console.log(`${provider} 登入成功，數據:`, data);
  return data;
};

export const signInSolana = async () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase 環境變數未設定。請在 .env.local 文件中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_KEY"
    );
  }

  console.log("開始 Solana 錢包登入流程...");

  // 檢查是否支援 Solana 錢包
  if (!window.solana) {
    console.error("未檢測到 Solana 錢包擴展");
    throw new Error("請安裝 Solana 錢包擴展（如 Phantom、Solflare 等）");
  }

  console.log("檢測到 Solana 錢包:", window.solana);

  // 檢查錢包是否已連接
  if (!window.solana.isConnected) {
    try {
      console.log("嘗試連接 Solana 錢包...");
      const connection = await window.solana.connect();
      console.log("Solana 錢包連接成功:", connection);
    } catch (error) {
      console.error("Solana 錢包連接失敗:", error);
      throw new Error("無法連接到 Solana 錢包，請檢查錢包設定");
    }
  }

  try {
    console.log("開始 Web3 認證...");
    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: "solana",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Web3 認證錯誤:", error);
      throw error;
    }

    console.log("Solana 錢包登入成功:", data);
    return data;
  } catch (error) {
    console.error("Solana 登入過程錯誤:", error);

    // 提供更具體的錯誤訊息
    if (error instanceof Error) {
      if (error.message.includes("signature request")) {
        throw new Error("錢包簽名請求失敗，請確保錢包已正確連接並授權");
      } else if (error.message.includes("user rejected")) {
        throw new Error("用戶拒絕了簽名請求");
      } else {
        throw error;
      }
    } else {
      throw new Error("Solana 錢包登入失敗，請稍後再試");
    }
  }
};
