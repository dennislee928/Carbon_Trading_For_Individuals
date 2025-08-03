# Solana 錢包登入設定指南

## 在 Supabase Dashboard 中啟用 Solana 登入

### 1. 登入 Supabase Dashboard

- 前往 [https://supabase.com/dashboard](https://supabase.com/dashboard)
- 選擇您的專案

### 2. 配置 Authentication

1. 在左側導航中點擊 **Authentication**
2. 點擊 **Providers** 標籤
3. 找到 **Web3 Wallet** 提供者
4. 點擊 **Enable** 啟用 Web3 錢包登入

### 3. 配置 Web3 Wallet 設定

在 Web3 Wallet 提供者設定中，您需要配置以下選項：

#### 基本設定

- **Enabled**: 啟用 Web3 錢包登入
- **Chain**: 選擇 Solana 鏈

#### 進階設定

- **Rate Limiting**: 設定適當的速率限制以防止濫用（建議：每5分鐘30次登入嘗試）
- **CAPTCHA Protection**: 啟用 CAPTCHA 保護以防止機器人攻擊
- **Redirect URL**: 設定您的應用程式 URL（例如：`https://your-domain.com/**`）

### 4. 環境變數配置

確保您的 `.env.local` 文件包含正確的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. 測試 Solana 登入

1. 重新啟動開發伺服器：`npm run dev`
2. 前往登入頁面
3. 點擊 "使用 Solana Wallet 登入" 按鈕
4. 選擇您的 Solana 錢包（如 Phantom、Solflare 等）
5. 授權登入

## 常見問題

### Q: 為什麼會出現 "Unsupported provider" 錯誤？

A: 這通常是因為：

1. Supabase 專案中未啟用 Web3 Wallet 提供者
2. 環境變數配置不正確
3. 需要重新啟動開發伺服器
4. 使用了錯誤的 API 方法（應該使用 `signInWithWeb3` 而不是 `signInWithOAuth`）

### Q: 如何處理 Solana 錢包連接問題？

A: 確保：

1. 用戶已安裝 Solana 錢包擴展
2. 錢包已連接到正確的網路（主網或測試網）
3. 用戶已授權應用程式訪問錢包

### Q: 如何自定義 Solana 登入流程？

A: 您可以在 `signInSolana` 函數中添加自定義邏輯：

```typescript
export const signInSolana = async () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase 環境變數未設定");
  }

  // 檢查是否支援 Solana 錢包
  if (!window.solana) {
    throw new Error("請安裝 Solana 錢包擴展");
  }

  // 確保錢包已連接
  try {
    await window.solana.connect();
  } catch (error) {
    throw new Error("無法連接到 Solana 錢包，請檢查錢包設定");
  }

  const { data, error } = await supabase.auth.signInWithWeb3({
    chain: 'solana',
    statement: '我同意碳交易平台的服務條款和隱私政策',
  });

  if (error) throw error;
  return data;
};
```

## 安全注意事項

1. **速率限制**: 設定適當的速率限制以防止暴力攻擊
2. **攻擊防護**: 啟用 Supabase 的攻擊防護功能
3. **錢包驗證**: 驗證用戶的 Solana 錢包地址
4. **錯誤處理**: 妥善處理登入錯誤和異常情況

## Web3 認證工作原理

### EIP-4361 標準
Supabase 的 Web3 認證使用 EIP-4361 標準來驗證錢包地址。這個標準允許用戶使用他們的 Web3 錢包進行離線認證。

### 認證流程
1. **錢包連接**: 用戶連接他們的 Solana 錢包
2. **訊息簽名**: 應用程式要求用戶簽署預定義的訊息
3. **驗證**: Supabase 驗證簽名的有效性
4. **創建會話**: 如果驗證成功，創建用戶帳戶或會話

### 安全考量
- Web3 錢包帳戶沒有關聯的電子郵件或電話號碼
- 創建 Web3 錢包帳戶是免費且容易自動化的
- 建議啟用速率限制和 CAPTCHA 保護

## 參考資源

- [Supabase Web3 Auth Documentation](https://supabase.com/docs/guides/auth/auth-web3)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Sign in with Solana (SIWS)](https://docs.solana.com/developing/wallet-guide/sign-in-with-solana)
- [EIP-4361 Standard](https://eips.ethereum.org/EIPS/eip-4361)
