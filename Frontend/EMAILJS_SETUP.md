# EmailJS 設置指南

## 1. 註冊 EmailJS 帳戶

1. 前往 [EmailJS](https://www.emailjs.com/) 註冊帳戶
2. 選擇免費方案（每月 200 封郵件）

## 2. 創建 Email Service

1. 在 EmailJS 控制台中，前往 "Email Services"
2. 點擊 "Add New Service"
3. 選擇您的郵件服務商（如 Gmail、Outlook 等）
4. 按照指示連接您的郵件帳戶

## 3. 創建 Email Template

1. 前往 "Email Templates"
2. 點擊 "Create New Template"
3. 使用以下模板內容：

### 模板內容：

**Subject:** 碳交易平台 - 密碼重置驗證碼

**HTML 內容：**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>密碼重置驗證碼</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; margin: 0;">碳交易平台</h1>
      </div>

      <div
        style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; border-left: 4px solid #16a34a;"
      >
        <h2 style="margin-top: 0; color: #333;">密碼重置請求</h2>

        <p>親愛的 {{user_name}}，</p>

        <p>我們收到了您的密碼重置請求。請使用以下驗證碼來重置您的密碼：</p>

        <div
          style="background-color: #16a34a; color: white; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 3px;"
        >
          {{otp_code}}
        </div>

        <p><strong>重要提醒：</strong></p>
        <ul>
          <li>此驗證碼將在 10 分鐘後過期</li>
          <li>請勿將此驗證碼分享給任何人</li>
          <li>如果您沒有請求重置密碼，請忽略此郵件</li>
        </ul>

        <p>如果您需要幫助，請聯繫我們的客服團隊。</p>

        <p>
          謝謝！<br />
          碳交易平台團隊
        </p>
      </div>

      <div
        style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;"
      >
        <p>此郵件由系統自動發送，請勿回覆</p>
      </div>
    </div>
  </body>
</html>
```

### 重要：模板設定

在 EmailJS 模板設定中，您需要：

1. **設定收件人欄位**：

   - 在模板的 "To Email" 欄位中，輸入：`{{to_email}}`
   - 或者使用：`{{to_name}} <{{to_email}}>`

2. **設定發件人欄位**：

   - 在 "From Name" 欄位中，輸入：`{{from_name}}` 或直接輸入 "碳交易平台"
   - 在 "From Email" 欄位中，使用您的 Email Service 地址

3. **模板變數**：
   確保模板包含以下變數：
   - `{{to_email}}` - 收件人郵箱地址
   - `{{user_name}}` - 用戶名稱
   - `{{otp_code}}` - OTP 驗證碼
   - `{{from_name}}` - 發件人名稱（可選）

## 4. 獲取配置信息

1. **Service ID**: 在 "Email Services" 頁面找到您的服務 ID
2. **Template ID**: 在 "Email Templates" 頁面找到您的模板 ID
3. **Public Key**: 在 "Account" > "API Keys" 頁面找到您的 Public Key

## 5. 設置環境變數

在 `Frontend/.env.local` 文件中添加：

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 6. 測試和調試

### 使用調試頁面

1. 啟動開發服務器：`npm run dev`
2. 訪問 `/emailjs-debug` 頁面
3. 檢查配置狀態
4. 發送測試郵件

### 手動測試

1. 訪問 `/forgot-password` 頁面
2. 輸入測試郵箱地址
3. 檢查是否收到包含 OTP 的郵件

## 7. 故障排除

### 常見錯誤和解決方案

#### "The recipients address is empty" 錯誤

**原因**：EmailJS 模板中沒有正確設定收件人欄位

**解決方案**：

1. 在 EmailJS 控制台中編輯您的模板
2. 在 "To Email" 欄位中輸入：`{{to_email}}`
3. 確保模板變數名稱正確

#### "Template not found" 錯誤

**原因**：Template ID 不正確或模板不存在

**解決方案**：

1. 檢查 Template ID 是否正確
2. 確認模板是否已發布
3. 重新複製 Template ID

#### "Service not found" 錯誤

**原因**：Service ID 不正確或服務未設定

**解決方案**：

1. 檢查 Service ID 是否正確
2. 確認 Email Service 是否已連接
3. 重新設定 Email Service

### 調試步驟

1. **檢查環境變數**：

   ```bash
   # 在瀏覽器控制台中檢查
   console.log(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
   console.log(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
   console.log(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
   ```

2. **檢查 EmailJS 配置**：

   ```javascript
   import EmailJSService from "./services/emailjs";
   console.log(EmailJSService.getConfigStatus());
   ```

3. **測試連接**：
   ```javascript
   EmailJSService.testConnection().then((result) => {
     console.log("連接測試結果:", result);
   });
   ```

## 注意事項

- 免費方案每月限制 200 封郵件
- 確保郵件服務商允許第三方應用訪問
- 在生產環境中，建議使用更安全的 OTP 存儲方式（如後端數據庫）
- 考慮添加 OTP 過期時間和重試次數限制
- 定期檢查 EmailJS 帳戶狀態和郵件發送限制
