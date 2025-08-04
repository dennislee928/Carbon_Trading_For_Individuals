# 簡化 Solana 錢包登入設定指南

## 概述

這是一個最簡化的 Supabase + Solana (Phantom) 錢包登入整合方案，不需要 nonce，使用固定簽名訊息。

**⚠️ 警告**: 此方法存在重放攻擊風險，建議僅用於開發測試或低安全性需求的場景。

## 前端設定

### 1. 安裝依賴

```bash
npm install @solana/web3.js bs58
```

### 2. 更新 supabase.ts

已經完成，包含以下功能：
- `signInSolana()`: 主要的登入函數
- `signUpWithSolana()`: 自動註冊函數
- 使用固定簽名訊息："請簽署此訊息以登入我們的應用程式。"

### 3. 登入流程

1. 用戶點擊 "使用 Solana Wallet 登入" 按鈕
2. 連接 Phantom 錢包
3. 獲取錢包公鑰
4. 簽署固定訊息
5. 使用公鑰作為 email，簽名作為 password 進行 Supabase 登入
6. 如果用戶不存在，自動註冊新帳戶

## 後端設定 (Supabase)

### 1. 創建 Edge Function

在 Supabase 專案中創建 Edge Function：

```bash
supabase functions new solana-password-verifier
```

### 2. 部署 Edge Function

```bash
supabase functions deploy solana-password-verifier
```

### 3. 設定 Authentication Hook

1. 前往 Supabase Dashboard
2. 點擊 **Authentication** → **Hooks**
3. 在 **Password Verifier** 區塊點擊 **Add hook**
4. 選擇 **solana-password-verifier** 函數
5. 啟用該 hook

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

### 簽名驗證流程

1. **前端**: 使用 `@solana/web3.js` 和 `bs58` 處理簽名
2. **後端**: 使用 `tweetnacl` 驗證簽名
3. **Supabase**: 通過 Authentication Hook 處理驗證結果

### 錯誤處理

- 錢包未安裝
- 用戶拒絕連接
- 用戶拒絕簽名
- 簽名驗證失敗
- 自動註冊失敗

## 安全考量

### 當前風險

1. **重放攻擊**: 固定簽名訊息可能被重複使用
2. **中間人攻擊**: 簽名可能被截獲
3. **無時間戳**: 無法確保簽名的時效性

### 改進建議

1. **添加 Nonce**: 每次登入使用唯一的隨機數
2. **時間戳**: 添加簽名時間限制
3. **域名驗證**: 驗證簽名中的域名
4. **速率限制**: 限制登入嘗試次數

## 生產環境建議

對於生產環境，建議：

1. 使用 Supabase 的 `signInWithWeb3` 方法
2. 實現完整的 SIWS (Sign-In with Solana) 標準
3. 添加適當的安全措施
4. 使用 HTTPS 確保傳輸安全

## 故障排除

### 常見問題

1. **"Phantom not found"**: 確保已安裝 Phantom 錢包擴展
2. **"Invalid signature"**: 檢查 Edge Function 是否正確部署
3. **"Invalid login credentials"**: 檢查簽名驗證邏輯

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
  const messageToSign = "請簽署此訊息以登入我們的應用程式。";
  const encodedMessage = new TextEncoder().encode(messageToSign);
  const { signature } = await provider.signMessage(encodedMessage, "utf8");
  const signature58 = bs58.encode(signature);

  // Supabase 登入
  const { data, error } = await supabase.auth.signInWithPassword({
    email: publicKey58,
    password: signature58,
  });

  if (error && error.message.includes("Invalid login credentials")) {
    // 自動註冊
    return await signUpWithSolana(publicKey58, signature58, messageToSign);
  }

  return data;
};
```

### 後端驗證函數

```typescript
serve(async (req) => {
  const { email: publicKeyStr, password: signatureStr, data } = await req.json();
  
  const messageToSign = data?.original_message || "請簽署此訊息以登入我們的應用程式。";
  const messageBytes = new TextEncoder().encode(messageToSign);
  const publicKeyBytes = bs58.decode(publicKeyStr);
  const signatureBytes = bs58.decode(signatureStr);

  const isVerified = nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes
  );

  return new Response(
    JSON.stringify({
      decision: isVerified ? 'accept' : 'reject',
    }),
    { headers: { 'Content-Type': 'application/json' }, status: 200 }
  );
});
```

## 總結

這個簡化方案提供了最快速的 Supabase + Solana 錢包登入整合，適合開發和測試階段使用。對於生產環境，建議實施更完整的安全措施。 