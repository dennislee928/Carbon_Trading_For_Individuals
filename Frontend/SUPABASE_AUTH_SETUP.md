# Supabase 認證配置完整指南

## 問題診斷

根據錯誤日誌，您的應用程式遇到了以下問題：

1. **GitHub 登入失敗**: `"Unsupported provider: Provider github could not be found"`
2. **Google 登入失敗**: `"Unsupported provider: Provider google could not be found"`
3. **Solana 錢包登入失敗**: 需要錢包擴展
4. **Auth Callback 頁面錯誤**: 頁面為空，導致認證回調失敗

## 解決方案

### 1. 在 Supabase Dashboard 中配置 OAuth 提供者

#### 步驟 1: 登入 Supabase Dashboard

1. 前往 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 選擇您的專案：`ymgxleuooeytcusgbson`

#### 步驟 2: 配置 GitHub OAuth

1. 在左側導航中點擊 **Authentication**
2. 點擊 **Providers** 標籤
3. 找到 **GitHub** 提供者
4. 點擊 **Enable** 啟用 GitHub 登入
5. 配置以下設定：
   - **Client ID**: 您的 GitHub OAuth App Client ID
   - **Client Secret**: 您的 GitHub OAuth App Client Secret
   - **Redirect URL**: `https://carbontrading.dennisleehappy.org/auth/callback`

#### 步驟 3: 配置 Google OAuth

1. 在同一頁面找到 **Google** 提供者
2. 點擊 **Enable** 啟用 Google 登入
3. 配置以下設定：
   - **Client ID**: 您的 Google OAuth Client ID
   - **Client Secret**: 您的 Google OAuth Client Secret
   - **Redirect URL**: `https://carbontrading.dennisleehappy.org/auth/callback`

#### 步驟 4: 配置 Web3 Wallet (Solana)

1. 找到 **Web3 Wallet** 提供者
2. 點擊 **Enable** 啟用 Web3 錢包登入
3. 配置以下設定：
   - **Chain**: 選擇 Solana
   - **Rate Limiting**: 設定為 30 (每 5 分鐘)
   - **CAPTCHA Protection**: 啟用

### 2. 創建 GitHub OAuth App

#### 步驟 1: 前往 GitHub Developer Settings

1. 登入 GitHub
2. 前往 [GitHub Developer Settings](https://github.com/settings/developers)
3. 點擊 **OAuth Apps** > **New OAuth App**

#### 步驟 2: 配置 OAuth App

```
Application name: Carbon Trading Platform
Homepage URL: https://carbontrading.dennisleehappy.org
Authorization callback URL: https://ymgxleuooeytcusgbson.supabase.co/auth/v1/callback
```

#### 步驟 3: 獲取憑證

- 複製 **Client ID** 和 **Client Secret**
- 將這些值填入 Supabase Dashboard 的 GitHub 提供者設定中

### 3. 創建 Google OAuth Client

#### 步驟 1: 前往 Google Cloud Console

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇或創建專案
3. 前往 **APIs & Services** > **Credentials**

#### 步驟 2: 創建 OAuth 2.0 Client ID

1. 點擊 **Create Credentials** > **OAuth 2.0 Client ID**
2. 選擇 **Web application**
3. 配置以下設定：
   - **Name**: Carbon Trading Platform
   - **Authorized JavaScript origins**: `https://carbontrading.dennisleehappy.org`
   - **Authorized redirect URIs**: `https://ymgxleuooeytcusgbson.supabase.co/auth/v1/callback`

#### 步驟 3: 獲取憑證

- 複製 **Client ID** 和 **Client Secret**
- 將這些值填入 Supabase Dashboard 的 Google 提供者設定中

### 4. 環境變數配置

確保您的 `.env.local` 文件包含正確的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://ymgxleuooeytcusgbson.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. 測試登入流程

#### 測試步驟：

1. 重新啟動開發伺服器：`npm run dev`
2. 前往登入頁面：`https://carbontrading.dennisleehappy.org/login`
3. 測試 GitHub 登入
4. 測試 Google 登入
5. 測試 Solana 錢包登入（需要安裝 Phantom 或 Solflare 擴展）

## 常見問題解決

### Q: 為什麼會出現 "Unsupported provider" 錯誤？

A: 這通常是因為：

1. Supabase 專案中未啟用對應的 OAuth 提供者
2. OAuth App 配置不正確
3. Redirect URL 不匹配

### Q: Solana 錢包登入需要什麼？

A: 用戶需要：

1. 安裝 Solana 錢包擴展（如 Phantom、Solflare）
2. 確保錢包已連接到正確的網路
3. 授權應用程式訪問錢包

### Q: Auth Callback 頁面顯示錯誤怎麼辦？

A: 檢查：

1. Supabase 專案設定中的 Redirect URL
2. OAuth App 的 Callback URL
3. 環境變數配置

## 安全注意事項

1. **保護 OAuth 憑證**：

   - 不要將 Client Secret 提交到版本控制
   - 使用環境變數存儲敏感資訊

2. **設定適當的 Redirect URL**：

   - 只允許您的域名
   - 避免使用通配符

3. **啟用安全功能**：
   - 啟用 CAPTCHA 保護
   - 設定適當的速率限制
   - 啟用攻擊防護

## 監控和調試

### 檢查 Supabase 日誌

1. 在 Supabase Dashboard 中前往 **Logs**
2. 查看 Authentication 日誌
3. 檢查錯誤和警告訊息

### 檢查瀏覽器控制台

1. 打開開發者工具
2. 查看 Console 和 Network 標籤
3. 檢查 API 請求和錯誤訊息

## 參考資源

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth App Setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

---

**重要提醒**: 完成配置後，請重新啟動應用程式並測試所有登入方式。如果仍有問題，請檢查 Supabase Dashboard 中的日誌以獲取詳細錯誤資訊。
