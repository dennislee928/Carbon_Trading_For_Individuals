# 碳交易 API 端點文檔

## 概述

本文件描述了碳交易平台的核心 API 端點，所有端點都位於 `/api/carbon/` 路徑下。

## 端點列表

### 1. 市場統計

**端點:** `GET /api/carbon/market/stats`

**描述:** 獲取碳交易市場的統計數據

**回應範例:**

```json
{
  "total_projects": 156,
  "total_tokens": 2847,
  "total_available_tokens": 1893,
  "total_retired_tokens": 954,
  "total_sales_usd": 2847500,
  "total_volume_tco2e": 2847.5,
  "average_price_usd": 12.45,
  "highest_price_usd": 28.90,
  "lowest_price_usd": 3.20,
  "price_history": [...],
  "volume_history": [...],
  "top_project_types": [...],
  "top_project_locations": [...]
}
```

### 2. 碳權項目

**端點:** `GET /api/carbon/projects`

**查詢參數:**

- `page` (可選): 頁碼，預設為 1
- `limit` (可選): 每頁數量，預設為 10
- `type` (可選): 項目類型過濾
- `location` (可選): 項目位置過濾

**回應範例:**

```json
{
  "projects": [
    {
      "id": "proj-001",
      "name": "台灣太陽能發電項目",
      "type": "再生能源",
      "location": "台灣",
      "price_per_credit": 12.5,
      "available_credits": 35000
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### 3. 碳權代幣

**端點:** `GET /api/carbon/tokens`

**查詢參數:**

- `page` (可選): 頁碼，預設為 1
- `limit` (可選): 每頁數量，預設為 10
- `min_price` (可選): 最低價格過濾
- `max_price` (可選): 最高價格過濾

**回應範例:**

```json
{
  "tokens": [
    {
      "id": "token-001",
      "name": "台灣太陽能碳權代幣",
      "symbol": "TWSOLAR",
      "price_per_unit": 12.5,
      "supply_remaining": 35000
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

### 4. 碳足跡計算

**端點:** `POST /api/carbon/footprint/calculate`

**請求體:**

```json
{
  "activity_type": "electricity",
  "quantity": 100,
  "unit": "kWh",
  "country_code": "TW",
  "date": "2024-01-01",
  "description": "家庭用電"
}
```

**支援的活動類型:**

- `electricity`: 電力使用
- `natural_gas`: 天然氣
- `fuel`: 燃料
- `waste`: 廢棄物
- `water`: 用水
- `travel`: 交通

**回應範例:**

```json
{
  "emission_amount": 50,
  "emission_source": "electricity",
  "unit": "kg CO2e",
  "breakdown": {
    "electricity": 50
  },
  "offset_options": [
    {
      "project_id": "proj-001",
      "project_name": "台灣太陽能發電項目",
      "price_per_unit": 12.5,
      "token_amount": 50,
      "total_price": 625
    }
  ]
}
```

### 5. 抵消模擬

**端點:** `POST /api/carbon/offset/simulate`

**請求體:**

```json
{
  "project_id": "proj-001",
  "token_amount": 100,
  "user_id": "user123"
}
```

**回應範例:**

```json
{
  "success": true,
  "project_id": "proj-001",
  "project_name": "台灣太陽能發電項目",
  "token_amount": 100,
  "price_per_token": 12.5,
  "total_price_usd": 1250,
  "final_price_usd": 1275,
  "estimated_fees": 25,
  "transaction_id": "tx_1234567890_abc123",
  "offset_equivalent": {
    "kg CO2e": 100,
    "trees_planted": 10,
    "km_car_equivalent": 500,
    "kwh_electricity_saved": 200
  }
}
```

## 錯誤處理

所有端點都遵循統一的錯誤回應格式：

```json
{
  "error": "錯誤訊息描述"
}
```

常見的 HTTP 狀態碼：

- `200`: 成功
- `400`: 請求參數錯誤
- `404`: 資源不存在
- `500`: 伺服器內部錯誤

## 測試

可以使用提供的測試腳本進行端點測試：

```bash
node api-test/carbon-api-test.js
```

## 注意事項

1. 目前所有端點都使用模擬數據
2. 價格以美元 (USD) 為單位
3. 碳排放量以 kg CO2e 為單位
4. 所有日期格式為 ISO 8601 (YYYY-MM-DD)
