# Gmail API 認證問題解決指南

## 問題描述

您遇到的錯誤是：`Gmail_API: Request had insufficient authentication scopes.`

這表示您的 Gmail 服務在 EmailJS 中的認證範圍不足，無法發送郵件。

## 解決方案

### 方案 1：重新設定 Gmail 服務（推薦）

1. **前往 EmailJS 控制台**

   - 登入 [EmailJS Dashboard](https://dashboard.emailjs.com/)
   - 前往 "Email Services" 頁面

2. **刪除現有的 Gmail 服務**

   - 找到您現有的 Gmail 服務
   - 點擊刪除或移除該服務

3. **重新添加 Gmail 服務**

   - 點擊 "Add New Service"
   - 選擇 "Gmail"
   - 按照新的認證流程操作

4. **授權 Gmail 帳戶**
   - 點擊 "Connect Account"
   - 登入您的 Gmail 帳戶
   - **重要**：確保授權所有必要的權限
   - 接受所有權限請求

### 方案 2：檢查 Gmail 帳戶設定

1. **啟用兩步驟驗證**

   - 前往 [Google 帳戶設定](https://myaccount.google.com/)
   - 啟用兩步驟驗證（如果尚未啟用）

2. **生成應用程式密碼**
   - 在 Google 帳戶設定中，前往 "安全性"
   - 找到 "應用程式密碼"
   - 為 EmailJS 生成一個新的應用程式密碼
   - 使用這個密碼而不是您的 Gmail 密碼

### 方案 3：使用其他郵件服務商

如果 Gmail 持續出現問題，可以考慮使用其他服務商：

#### Outlook/Hotmail

1. 在 EmailJS 中添加 "Outlook" 服務
2. 使用您的 Outlook 帳戶登入
3. 授權 EmailJS 訪問

#### 自定義 SMTP

1. 如果您有自己的郵件伺服器
2. 選擇 "Custom SMTP" 服務
3. 輸入 SMTP 設定

## 詳細步驟

### 重新設定 Gmail 服務的完整流程

1. **準備工作**

   ```
   確保您的 Gmail 帳戶：
   - 已啟用兩步驟驗證
   - 有應用程式密碼（如果需要）
   - 沒有安全限制
   ```

2. **在 EmailJS 中操作**

   ```
   1. 前往 EmailJS Dashboard
   2. 點擊 "Email Services"
   3. 刪除現有的 Gmail 服務
   4. 點擊 "Add New Service"
   5. 選擇 "Gmail"
   6. 點擊 "Connect Account"
   7. 登入 Gmail 並授權
   8. 確保接受所有權限
   ```

3. **測試連接**
   ```
   1. 保存服務設定
   2. 前往 "Email Templates"
   3. 編輯您的模板
   4. 點擊 "Test It" 按鈕
   5. 發送測試郵件
   ```

## 常見問題

### Q: 為什麼會出現認證範圍不足的錯誤？

A: 這通常是因為：

- Gmail 帳戶的安全設定過於嚴格
- 授權時沒有接受所有必要的權限
- 使用了過期的認證信息

### Q: 如何檢查 Gmail 的授權狀態？

A:

1. 前往 [Google 帳戶設定](https://myaccount.google.com/)
2. 點擊 "安全性"
3. 查看 "第三方應用程式存取權"
4. 確認 EmailJS 是否有適當的權限

### Q: 如果重新設定後仍然有問題怎麼辦？

A: 嘗試以下步驟：

1. 清除瀏覽器快取和 Cookie
2. 使用無痕模式重新設定
3. 嘗試使用不同的 Gmail 帳戶
4. 考慮使用其他郵件服務商

## 替代方案

### 使用 Outlook/Hotmail

```
優點：
- 通常認證更簡單
- 與 EmailJS 整合良好
- 免費方案支援

設定步驟：
1. 在 EmailJS 中添加 "Outlook" 服務
2. 使用 Microsoft 帳戶登入
3. 授權 EmailJS 訪問
```

### 使用自定義 SMTP

```
如果您有自己的郵件伺服器：
1. 選擇 "Custom SMTP" 服務
2. 輸入 SMTP 伺服器設定
3. 使用您的郵件帳戶認證
```

## 測試修復

修復完成後：

1. **重新啟動開發服務器**

   ```bash
   npm run dev
   ```

2. **訪問調試頁面**

   ```
   http://localhost:3000/emailjs-debug
   ```

3. **檢查配置狀態**

   - 確認所有配置都顯示為 "已設定"

4. **發送測試郵件**
   - 輸入測試郵箱地址
   - 點擊發送測試郵件
   - 檢查是否收到郵件

## 預防措施

1. **定期檢查授權狀態**

   - 每月檢查一次 Gmail 的第三方應用程式權限

2. **備用郵件服務**

   - 設定多個郵件服務作為備用

3. **監控郵件發送狀態**
   - 定期檢查 EmailJS 的發送日誌

## 聯繫支援

如果問題持續存在：

1. 檢查 EmailJS 的官方文檔
2. 查看 EmailJS 的錯誤日誌
3. 聯繫 EmailJS 支援團隊
4. 考慮使用其他郵件服務商
