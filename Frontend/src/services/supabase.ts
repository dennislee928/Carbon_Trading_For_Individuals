import { createClient } from "@supabase/supabase-js";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

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

// 和 Edge Function 中定義的訊息必須完全一致
const SIGN_IN_MESSAGE = "請簽署此訊息以登入我們的應用程式。";

/**
 * 免費方案的 Solana 登入函式
 * 使用 Edge Function 進行簽名驗證，適用於 Supabase 免費方案
 */
export const signInSolana = async () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase 環境變數未設定。請在 .env.local 文件中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_KEY"
    );
  }

  try {
    const provider = (window as any).phantom?.solana;
    if (!provider || !provider.isPhantom) {
      alert("請先安裝 Phantom 錢包！");
      throw new Error("Phantom not found");
    }

    console.log("檢測到 Solana 錢包:", provider);

    // 1. 連接錢包並獲取公鑰
    const resp = await provider.connect({ onlyIfTrusted: false }); // 確保會彈出視窗
    const publicKey = new PublicKey(resp.publicKey.toString());
    const publicKey58 = publicKey.toBase58();
    console.log("錢包已連接，公鑰:", publicKey58);

    // 2. 簽署固定訊息
    const encodedMessage = new TextEncoder().encode(SIGN_IN_MESSAGE);
    const { signature } = await provider.signMessage(encodedMessage, "utf8");
    const signature58 = bs58.encode(signature);
    console.log("訊息已簽名:", signature58);

    // 3. 呼叫我們的自訂 Edge Function
    console.log("呼叫 Edge Function 進行認證...");
    const { data, error: funcError } = await supabase.functions.invoke(
      "solana-auth",
      {
        body: {
          publicKey: publicKey58,
          signature: signature58,
        },
      }
    );

    if (funcError) {
      console.error("Edge function error:", funcError);
      throw new Error(`認證失敗: ${funcError.message}`);
    }

    if (data.error) {
      console.error("Edge function returned error:", data.error);
      throw new Error(`認證失敗: ${data.error}`);
    }

    console.log("Edge Function 認證成功，設定 session...");

    // 4. 收到 token 後，手動設定 session
    // 檢查是否是特殊的認證成功訊息
    if (data.access_token === "solana-wallet-auth-success") {
      console.log("收到 Solana 錢包認證成功訊息");

      // 使用從 Edge Function 返回的密碼進行登入
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: data.user.email,
          password: data.password, // 使用從 Edge Function 返回的密碼
        });

      if (signInError) {
        console.error("signInWithPassword 錯誤:", signInError);
        throw new Error(`密碼登入失敗: ${signInError.message}`);
      }

      console.log("Solana 錢包登入成功!", signInData.session);
      return signInData;
    } else {
      // 正常的 token 設定流程
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

      if (sessionError) {
        console.error("Failed to set session:", sessionError);
        throw new Error(`Session 設定失敗: ${sessionError.message}`);
      }

      console.log("Solana 錢包登入成功!", sessionData.session);
      return sessionData;
    }
  } catch (err: any) {
    console.error("Solana 登入流程出錯:", err);
    // 處理使用者拒絕連接或簽名的情況
    if (err.code === 4001) {
      console.log("使用者拒絕了簽名請求。");
      throw new Error("使用者拒絕了簽名請求");
    }
    throw err;
  }
};
