import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nacl from "npm:tweetnacl@1.0.3";
import bs58 from "https://esm.sh/bs58@5.0.0";

// 固定的簽名訊息，必須和前端完全一樣
const SIGN_IN_MESSAGE = "請簽署此訊息以登入我們的應用程式。";

serve(async (req) => {
  // 處理 CORS Preflight 請求
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { publicKey, signature } = await req.json();
    if (!publicKey || !signature) {
      throw new Error("Public key or signature not provided.");
    }

    console.log("收到認證請求:", {
      publicKey: publicKey.slice(0, 8) + "...",
      signature: signature.slice(0, 8) + "...",
    });

    // 1. 驗證簽名
    const messageBytes = new TextEncoder().encode(SIGN_IN_MESSAGE);
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);

    const isVerified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!isVerified) {
      throw new Error("Invalid signature.");
    }

    console.log("簽名驗證成功");

    // 2. 創建一個擁有管理員權限的 Supabase client
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const adminAuthClient = adminClient.auth.admin;

    // 3. 檢查使用者是否存在，若不存在則創建
    let user;

    // 使用 listUsers 來搜尋使用者
    const { data: users, error: listUsersError } =
      await adminAuthClient.listUsers();
    if (listUsersError) throw listUsersError;

    // 尋找具有相同錢包地址的使用者
    const existingUser = users.users.find(
      (u) => u.user_metadata?.wallet_address === publicKey
    );

    if (!existingUser) {
      console.log("使用者不存在，創建新使用者");
      // 使用者不存在，創建一個
      // 使用有效的電子郵件格式，但將錢包地址存儲在 metadata 中
      const email = `${publicKey.slice(0, 8)}@solana.wallet`;
      const { data: newUser, error: createUserError } =
        await adminAuthClient.createUser({
          email: email,
          password: `solana-wallet-${Math.random().toString(36).substring(2)}`, // 隨機密碼
          email_confirm: true, // 因為錢包簽名已驗證所有權，所以直接設為 true
          user_metadata: {
            wallet_address: publicKey,
            auth_method: "solana_wallet",
            created_at: new Date().toISOString(),
          },
        });
      if (createUserError) throw createUserError;
      user = newUser.user;
      console.log("新使用者創建成功:", user.id);
    } else {
      user = existingUser;
      console.log("使用者已存在:", user.id);
    }

    // 4. 為使用者生成 JWT (包含 access_token 和 refresh_token)
    const { data: linkData, error: linkError } =
      await adminAuthClient.generateLink({
        type: "magiclink",
        email: user.email,
      });
    if (linkError) throw linkError;

    const { access_token, refresh_token } = linkData.properties;

    console.log("Token 生成成功");

    // 5. 回傳 token 給前端
    return new Response(
      JSON.stringify({
        access_token,
        refresh_token,
        user: {
          id: user.id,
          email: user.email,
          wallet_address: publicKey,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("認證錯誤:", error.message);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        },
        status: 400,
      }
    );
  }
});
