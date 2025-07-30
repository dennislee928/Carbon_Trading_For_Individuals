# EmailJS 快速修復指南

## 問題描述

您遇到的錯誤是：`"The recipients address is empty"`，這表示 EmailJS 模板中沒有正確設定收件人欄位。

## 立即解決步驟

### 1. 設定環境變數

我已經為您創建了 `.env.local` 文件，您需要：

1. 前往 [EmailJS 控制台](https://dashboard.emailjs.com/)
2. 獲取您的配置信息：

   - **Service ID**: Email Services 頁面
   - **Template ID**: Email Templates 頁面
   - **Public Key**: Account > API Keys 頁面

3. 編輯 `Frontend/.env.local` 文件，將以下值替換為您的實際配置：
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=您的實際_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=您的實際_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=您的實際_public_key
   ```

### 2. 修復 EmailJS 模板設定

**重要**：這是解決 "recipients address is empty" 錯誤的關鍵步驟

1. 在 EmailJS 控制台中，前往 "Email Templates"
2. 編輯您的模板
3. 在模板設定中，找到 "To Email" 欄位
4. 將 "To Email" 欄位設定為：`{{to_email}}`
5. 保存模板

### 3. 測試修復

1. 重新啟動開發服務器：

   ```bash
   npm run dev
   ```

2. 訪問調試頁面：`http://localhost:3000/emailjs-debug`
3. 檢查配置狀態是否顯示為 "完整"
4. 發送測試郵件

## 常見問題

### Q: 我沒有 EmailJS 帳戶怎麼辦？

A: 前往 [EmailJS](https://www.emailjs.com/) 註冊免費帳戶，每月可發送 200 封郵件。

### Q: 如何找到我的 Service ID？

A: 在 EmailJS 控制台的 "Email Services" 頁面，您會看到已連接的服務列表，每個服務都有一個 ID。

### Q: 如何找到我的 Template ID？

A: 在 EmailJS 控制台的 "Email Templates" 頁面，點擊您的模板，在 URL 或模板詳情中會顯示 Template ID。

### Q: 如何找到我的 Public Key？

A: 在 EmailJS 控制台的 "Account" > "API Keys" 頁面，您會看到您的 Public Key。

## 如果問題仍然存在

1. 檢查瀏覽器控制台的詳細錯誤信息
2. 確認所有環境變數都已正確設定
3. 確認 EmailJS 模板中的 "To Email" 欄位設定為 `{{to_email}}`
4. 檢查 EmailJS 帳戶是否有足夠的郵件配額

## 模擬模式

如果您暫時不想設定 EmailJS，系統會自動使用模擬模式：

- OTP 會顯示在瀏覽器控制台中
- 不會實際發送郵件
- 適合開發和測試階段

## 聯繫支援

如果問題仍然無法解決，請：

1. 檢查 EmailJS 官方文檔
2. 查看 EmailJS 控制台的錯誤日誌
3. 確認您的郵件服務商設定是否正確
