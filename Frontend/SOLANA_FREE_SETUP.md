# 免費方案 Solana 錢包登入設定指南

## 概述

這是一個完全免費的 Supabase + Solana (Phantom) 錢包登入整合方案，使用 Edge Function 進行簽名驗證，適用於 Supabase 免費方案。

## 優勢

✅ **完全免費**: 不需要 Supabase 付費功能  
✅ **功能完整**: 支援簽名驗證、用戶創建、自動登入  
✅ **安全可靠**: 使用 Edge Function 進行後端驗證  
✅ **易於部署**: 標準的 Supabase Edge Function

## 前端設定

### 1. 安裝依賴

```bash
npm install @solana/web3.js bs58
```

### 2. 更新 supabase.ts

已經完成，包含以下功能：

- `signInSolana()`: 主要的登入函數
- 使用 Edge Function 進行認證
- 自動設定 session

### 3. 登入流程

1. 用戶點擊 "使用 Solana Wallet 登入" 按鈕
2. 連接 Phantom 錢包
3. 獲取錢包公鑰
4. 簽署固定訊息
5. 呼叫 Edge Function 進行簽名驗證
6. Edge Function 創建/獲取用戶並生成 token
7. 前端設定 session 完成登入

## 後端設定 (Supabase)

### 1. 安裝 Supabase CLI

```bash
npm install -g supabase
```

### 2. 登入 Supabase

```bash
supabase login
```

### 3. 初始化專案 (如果還沒有)

```bash
supabase init
```

### 4. 創建 Edge Function

```bash
supabase functions new solana-auth
```

### 5. 部署 Edge Function

```bash
supabase functions deploy solana-auth
```

### 6. 設定環境變數

在 Supabase Dashboard 中設定以下環境變數：

- `SUPABASE_URL`: 您的 Supabase 專案 URL
- `SUPABASE_SERVICE_ROLE_KEY`: 您的 Supabase Service Role Key

## 測試

### 1. 測試頁面

訪問 `/solana-test` 頁面進行測試。

### 2. 測試步驟

1. 確保已安裝 Phantom 錢包擴展
2. 解鎖錢包
3. 點擊 "使用 Solana Wallet 登入" 按鈕
4. 授權連接錢包
5. 簽署訊息
6. 檢查是否成功登入

## 技術細節

### Edge Function 流程

1. **接收請求**: 接收公鑰和簽名
2. **驗證簽名**: 使用 `tweetnacl` 驗證簽名
3. **檢查用戶**: 使用 Service Role 檢查用戶是否存在
4. **創建用戶**: 如果不存在，自動創建新用戶
5. **生成 Token**: 使用 Magic Link 生成 JWT token
6. **返回結果**: 將 token 返回給前端

### 前端流程

1. **連接錢包**: 使用 Phantom 錢包 API
2. **獲取公鑰**: 從錢包獲取公鑰
3. **簽署訊息**: 簽署固定訊息
4. **呼叫 Edge Function**: 發送公鑰和簽名
5. **設定 Session**: 使用返回的 token 設定 session

## 安全考量

### 當前實現

1. **簽名驗證**: 使用 `tweetnacl` 進行密碼學驗證
2. **用戶隔離**: 每個錢包地址對應唯一用戶
3. **自動創建**: 新錢包自動創建用戶帳戶
4. **Token 管理**: 使用 Supabase 標準的 JWT token

### 改進建議

1. **添加 Nonce**: 每次登入使用唯一的隨機數
2. **時間戳**: 添加簽名時間限制
3. **域名驗證**: 驗證簽名中的域名
4. **速率限制**: 限制登入嘗試次數

## 故障排除

### 常見問題

1. **"Phantom not found"**: 確保已安裝 Phantom 錢包擴展
2. **"Edge function error"**: 檢查 Edge Function 是否正確部署
3. **"Invalid signature"**: 檢查簽名驗證邏輯
4. **"Service role key not found"**: 檢查環境變數設定

### 調試步驟

1. 檢查瀏覽器控制台錯誤
2. 檢查 Supabase Dashboard 的 Function 日誌
3. 確認環境變數設定正確
4. 驗證錢包連接狀態

## 代碼範例

### 前端登入函數

```typescript
export const signInSolana = async () => {
  const provider = (window as any).phantom?.solana;
  if (!provider || !provider.isPhantom) {
    throw new Error("Phantom not found");
  }

  // 連接錢包
  const resp = await provider.connect();
  const publicKey = new PublicKey(resp.publicKey.toString());
  const publicKey58 = publicKey.toBase58();

  // 簽署訊息
  const encodedMessage = new TextEncoder().encode(SIGN_IN_MESSAGE);
  const { signature } = await provider.signMessage(encodedMessage, "utf8");
  const signature58 = bs58.encode(signature);

  // 呼叫 Edge Function
  const { data, error: funcError } = await supabase.functions.invoke(
    "solana-auth",
    {
      body: {
        publicKey: publicKey58,
        signature: signature58,
      },
    }
  );

  if (funcError) throw funcError;

  // 設定 session
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

  if (sessionError) throw sessionError;

  return sessionData;
};
```

### 後端 Edge Function

```typescript
serve(async (req) => {
  const { publicKey, signature } = await req.json();

  // 驗證簽名
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

  // 創建管理員客戶端
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // 檢查/創建用戶
  let user;
  const { data: existingUser, error: getUserError } =
    await adminClient.auth.admin.getUserByEmail(publicKey);

  if (getUserError && getUserError.message === "User not found") {
    const { data: newUser, error: createUserError } =
      await adminClient.auth.admin.createUser({
        email: publicKey,
        password: `solana-wallet-${Math.random().toString(36).substring(2)}`,
        email_confirm: true,
      });
    if (createUserError) throw createUserError;
    user = newUser.user;
  } else {
    user = existingUser.user;
  }

  // 生成 token
  const { data: linkData, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
    });
  if (linkError) throw linkError;

  const { access_token, refresh_token } = linkData.properties;

  return new Response(JSON.stringify({ access_token, refresh_token, user }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
```

## 部署檢查清單

- [ ] 安裝 Supabase CLI
- [ ] 登入 Supabase 帳戶
- [ ] 創建 Edge Function
- [ ] 設定環境變數
- [ ] 部署 Edge Function
- [ ] 測試登入功能
- [ ] 檢查錯誤日誌

## 總結

這個免費方案提供了完整的 Supabase + Solana 錢包登入功能，不需要任何付費功能，適合開發和生產環境使用。通過 Edge Function 進行簽名驗證，確保了安全性和可靠性。
