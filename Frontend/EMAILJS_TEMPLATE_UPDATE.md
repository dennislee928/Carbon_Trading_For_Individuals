# EmailJS 模板更新指南

## 基於您的截圖分析

根據您提供的 EmailJS 模板截圖，我發現以下需要更新的地方：

## 1. 模板內容更新

### 當前問題

您的模板目前是英文的 "Password Reset" 模板，需要更新為中文的 OTP 驗證碼模板。

### 建議的模板內容

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
        <p>發送給：{{to_email}}</p>
      </div>
    </div>
  </body>
</html>
```

## 2. 模板設定更新

### 收件人設定 (To Email)

**當前狀態：** `{{email}}`
**需要更新為：** `{{to_email}}`

### 發件人設定

**From Name：** 碳交易平台
**From Email：** 使用您的 Email Service 地址
**Reply To：** 可以設定為您的支援郵箱

## 3. 模板變數對應

| 模板變數        | 程式碼中的參數     | 說明           |
| --------------- | ------------------ | -------------- |
| `{{to_email}}`  | `params.to_email`  | 收件人郵箱地址 |
| `{{user_name}}` | `params.user_name` | 用戶名稱       |
| `{{otp_code}}`  | `params.otp_code`  | OTP 驗證碼     |

## 4. 更新步驟

### 步驟 1：更新模板內容

1. 在 EmailJS 控制台中編輯您的模板
2. 將 Subject 改為：`碳交易平台 - 密碼重置驗證碼`
3. 將 HTML 內容替換為上面提供的內容

### 步驟 2：更新收件人設定

1. 在右側設定面板中找到 "To Email" 欄位
2. 將 `{{email}}` 改為 `{{to_email}}`

### 步驟 3：更新發件人設定

1. **From Name：** 輸入 `碳交易平台`
2. **From Email：** 使用您的 Email Service 地址
3. **Reply To：** 可以設定為您的支援郵箱

### 步驟 4：測試模板

1. 點擊 "Test It" 按鈕
2. 輸入測試郵箱地址
3. 檢查是否收到正確格式的郵件

## 5. 重要提醒

1. **收件人欄位是關鍵**：必須將 "To Email" 設定為 `{{to_email}}`，這是解決 "recipients address is empty" 錯誤的關鍵

2. **模板變數名稱**：確保使用正確的變數名稱，與程式碼中的參數對應

3. **保存模板**：更新完成後記得點擊 "Save" 按鈕保存

4. **測試驗證**：使用調試頁面 `http://localhost:3000/emailjs-debug` 測試郵件發送

## 6. 如果不想更改現有模板

如果您想保持現有的英文模板，只需要：

1. 將 "To Email" 欄位從 `{{email}}` 改為 `{{to_email}}`
2. 確保模板中包含 `{{otp_code}}` 變數
3. 更新程式碼中的參數名稱以匹配模板變數

這樣就能解決當前的錯誤問題。
