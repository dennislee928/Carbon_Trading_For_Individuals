# 碳交易平台 API 端點與前端實現對應關係

本文檔記錄了 `https://apiv1-carbontrading.dennisleehappy.org/` 和 `https://api.climatiq.io` 這兩個 API 的端點在前端的實現情況。

## 1. 自訂碳交易 API (`https://apiv1-carbontrading.dennisleehappy.org/`)

### 1.1 用戶認證和管理

| API 端點         | 前端實現   | 檔案路徑                                    | 相關函數                                                 |
| ---------------- | ---------- | ------------------------------------------- | -------------------------------------------------------- |
| `/auth/login`    | 登入頁面   | `Frontend/src/app/pages/Login/page.tsx`     | `handleSubmit()` 調用 `carbonApi.login()`                |
| `/auth/register` | 註冊頁面   | `Frontend/src/app/pages/Register/page.tsx`  | `handleSubmit()` 調用 `carbonApi.register()`             |
| `/auth/me`       | 儀表板頁面 | `Frontend/src/app/pages/Dashboard/page.tsx` | `fetchDashboardData()` 調用 `carbonApi.getCurrentUser()` |
| 登出功能         | 儀表板頁面 | `Frontend/src/app/pages/Dashboard/page.tsx` | `handleLogout()` 調用 `carbonApi.logout()`               |

### 1.2 碳信用額相關

| API 端點              | 前端實現 | 檔案路徑                                 | 相關函數                                                   |
| --------------------- | -------- | ---------------------------------------- | ---------------------------------------------------------- |
| `/carbonCredits`      | 市場頁面 | `Frontend/src/app/pages/Market/page.tsx` | `fetchCarbonCredits()` 調用 `carbonApi.getCarbonCredits()` |
| `/carbonCredits/{id}` | 交易頁面 | `Frontend/src/app/pages/Trades/page.tsx` | `fetchCreditData()` 調用 `carbonApi.getCarbonCreditById()` |

### 1.3 交易相關

| API 端點                  | 前端實現   | 檔案路徑                                    | 相關函數                                                     |
| ------------------------- | ---------- | ------------------------------------------- | ------------------------------------------------------------ |
| `/trades/create`          | 交易頁面   | `Frontend/src/app/pages/Trades/page.tsx`    | `handleSubmit()` 調用 `carbonApi.createTrade()`              |
| `/trades/orders/{userId}` | 儀表板頁面 | `Frontend/src/app/pages/Dashboard/page.tsx` | `fetchDashboardData()` 調用 `carbonApi.getUserTradeOrders()` |

### 1.4 用戶資產相關

| API 端點                       | 前端實現     | 檔案路徑                                        | 相關函數                                                     |
| ------------------------------ | ------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| `/users/{userId}/assets`       | 儀表板頁面   | `Frontend/src/app/pages/Dashboard/page.tsx`     | `fetchDashboardData()` 調用 `carbonApi.getUserAssets()`      |
| `/users/{userId}/profile`      | 用戶資料頁面 | `Frontend/src/app/pages/profile/page.tsx`       | `handleSubmit()` 調用 `carbonApi.updateUserProfile()`        |
| `/users/{userId}/tradeHistory` | 交易歷史頁面 | `Frontend/src/app/pages/trade-history/page.tsx` | `fetchTradeHistory()` 調用 `carbonApi.getUserTradeHistory()` |

### 1.5 管理員功能

| API 端點            | 前端實現   | 檔案路徑                                | 相關函數                                                                                               |
| ------------------- | ---------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `/admin/users`      | 管理員頁面 | `Frontend/src/app/pages/admin/page.tsx` | `fetchAdminData()` 調用 `carbonApi.getAllUsers()`                                                      |
| `/admin/users/{id}` | 管理員頁面 | `Frontend/src/app/pages/admin/page.tsx` | `handleUpdateUser()` 調用 `carbonApi.updateUser()`; `handleDeleteUser()` 調用 `carbonApi.deleteUser()` |

## 2. Climatiq API (`https://api.climatiq.io`)

| 功能類型         | 前端實現     | 檔案路徑                                         | 相關函數                                           |
| ---------------- | ------------ | ------------------------------------------------ | -------------------------------------------------- |
| 分類搜尋         | API 服務     | `Frontend/src/app/services/api.ts`               | `climatiqApi.searchClassifications()`              |
| 排放因子搜尋     | API 服務     | `Frontend/src/app/services/api.ts`               | `climatiqApi.searchEmissionFactors()`              |
| 單位類型查詢     | API 服務     | `Frontend/src/app/services/api.ts`               | `climatiqApi.getUnitTypes()`                       |
| 採購排放計算     | 採購頁面     | `Frontend/src/app/pages/Procurement/page.tsx`    | 使用 `climatiqApi.calculateProcurementEmissions()` |
| 計算排放計算     | 計算頁面     | `Frontend/src/app/pages/Computing/page.tsx`      | 使用 `climatiqApi.calculateComputingEmissions()`   |
| 資料版本獲取     | API 服務     | `Frontend/src/app/services/api.ts`               | `climatiqApi.getDataVersions()`                    |
| 貨運排放計算     | 貨運頁面     | `Frontend/src/app/pages/Freight/page.tsx`        | 使用 `climatiqApi.calculateFreightEmissions()`     |
| 排放估算         | API 服務     | `Frontend/src/app/services/api.ts`               | `climatiqApi.estimateEmissions()`                  |
| 旅行排放計算     | 旅行頁面     | `Frontend/src/app/pages/Travel/page.tsx`         | 使用 `climatiqApi.calculateTravelEmissions()`      |
| 能源排放計算     | 能源頁面     | `Frontend/src/app/pages/Energy/page.tsx`         | 使用 `climatiqApi.calculateEnergyEmissions()`      |
| 自訂映射創建     | 自訂映射頁面 | `Frontend/src/app/pages/CustomMappings/page.tsx` | 使用 `climatiqApi.createCustomMapping()`           |
| CBAM 排放計算    | CBAM 頁面    | `Frontend/src/app/pages/CBAM/page.tsx`           | 使用 `climatiqApi.calculateCBAMEmissions()`        |
| 自動駕駛排放估算 | 自動駕駛頁面 | `Frontend/src/app/pages/Autopilot/page.tsx`      | 使用 `climatiqApi.estimateAutopilotEmissions()`    |

## 3. API 客戶端服務實現

### 3.1 碳交易 API 客戶端

- **檔案路徑**: `Frontend/src/app/services/carbonApi.ts` 和 `Frontend/src/services/carbonApi.ts`
- **基本設定**:
  ```typescript
  const API_CONFIG = {
    BASE_URL:
      process.env.NEXT_PUBLIC_CARBON_API_URL ||
      "https://apiv1-carbontrading.dennisleehappy.org",
    VERSION: "v1",
  };
  ```
- **攔截器設置**: 為每個請求添加 `Authorization` 頭部以進行用戶身份驗證
- **錯誤處理**: 集中式錯誤處理邏輯，提供有意義的錯誤信息

### 3.2 Climatiq API 客戶端

- **檔案路徑**: `Frontend/src/app/services/api.ts` 和 `Frontend/src/services/api.ts`
- **基本設定**:
  ```typescript
  const BASE_URL = CLIMATIQ_CONFIG.BASE_URL || "https://api.climatiq.io";
  const CLIMATIQ_API_KEY =
    CLIMATIQ_CONFIG.API_KEY ||
    validateEnv("NEXT_PUBLIC_CLIMATIQ_API_KEY", "NKFZH0Y8Q15KKFS84BQZ3MXC0G");
  ```
- **參數序列化**: 提供自訂參數序列化功能，特別是對複雜查詢參數
- **API 密鑰管理**: 從環境變數或配置獲取 API 密鑰

## 4. 頁面組件與 API 整合

| 頁面組件                  | 主要功能         | 使用的 API 服務                                                                                         |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `Login/page.tsx`          | 用戶登入         | `carbonApi.login()`                                                                                     |
| `Register/page.tsx`       | 用戶註冊         | `carbonApi.register()`                                                                                  |
| `Market/page.tsx`         | 碳交易市場       | `carbonApi.getCarbonCredits()`                                                                          |
| `Dashboard/page.tsx`      | 用戶儀表板       | `carbonApi.getCurrentUser()`, `carbonApi.getUserAssets()`, `carbonApi.getUserTradeOrders()`             |
| `Trades/page.tsx`         | 交易功能         | `carbonApi.getCarbonCreditById()`, `carbonApi.createTrade()`                                            |
| `profile/page.tsx`        | 用戶資料管理     | `carbonApi.getUserProfile()`, `carbonApi.updateUserProfile()`                                           |
| `trade-history/page.tsx`  | 交易歷史記錄     | `carbonApi.getUserTradeHistory()`                                                                       |
| `admin/page.tsx`          | 管理員功能       | `carbonApi.getAllUsers()`, `carbonApi.updateUser()`, `carbonApi.deleteUser()`, `carbonApi.createUser()` |
| `Procurement/page.tsx`    | 採購排放計算     | `climatiqApi.calculateProcurementEmissions()`                                                           |
| `Computing/page.tsx`      | 計算排放計算     | `climatiqApi.calculateComputingEmissions()`                                                             |
| `Freight/page.tsx`        | 貨運排放計算     | `climatiqApi.calculateFreightEmissions()`                                                               |
| `Travel/page.tsx`         | 旅行排放計算     | `climatiqApi.calculateTravelEmissions()`                                                                |
| `Energy/page.tsx`         | 能源排放計算     | `climatiqApi.calculateEnergyEmissions()`                                                                |
| `CustomMappings/page.tsx` | 自訂映射         | `climatiqApi.createCustomMapping()`                                                                     |
| `CBAM/page.tsx`           | CBAM 排放計算    | `climatiqApi.calculateCBAMEmissions()`                                                                  |
| `Autopilot/page.tsx`      | 自動駕駛排放估算 | `climatiqApi.estimateAutopilotEmissions()`                                                              |

## 5. API 配置優化

已對 API 配置進行以下優化:

1. 正確設定 base URL 分離:

   - 碳交易 API: `https://apiv1-carbontrading.dennisleehappy.org`
   - Climatiq API: `https://api.climatiq.io`

2. API 密鑰安全管理:

   - 優先使用環境變數
   - 提供合理的預設值
   - 為 Climatiq API 設定正確的認證頭部

3. 區分不同 API 的請求處理:

   - 使用獨立的 Axios 實例
   - 不同的錯誤處理邏輯
   - 不同的攔截器配置

4. 確保代碼結構一致性:
   - 統一的類型定義
   - 一致的錯誤處理模式
   - 良好的代碼組織

## 6. 新增頁面功能說明

### 6.1 用戶資料頁面 (`profile/page.tsx`)

- **主要功能**: 展示和編輯用戶個人資料
- **關鍵特性**:
  - 顯示用戶基本資訊
  - 允許用戶更新姓名
  - 顯示帳戶創建時間
  - 提供變更密碼的入口
  - 對管理員用戶提供進入管理面板的快捷鏈接

### 6.2 交易歷史頁面 (`trade-history/page.tsx`)

- **主要功能**: 展示用戶的所有交易記錄
- **關鍵特性**:
  - 按交易類型(購買/出售)篩選記錄
  - 展示交易統計數據(總交易數、購買交易、出售交易)
  - 計算交易總金額
  - 顯示交易詳細資訊，包括數量、單價、狀態和時間
  - 提供創建新交易的入口

### 6.3 管理員頁面 (`admin/page.tsx`)

- **主要功能**: 管理員管理所有用戶帳戶
- **關鍵特性**:
  - 顯示用戶統計資訊(總用戶數、管理員數量、普通用戶數量)
  - 創建新用戶功能
  - 用戶搜尋與篩選
  - 編輯用戶資訊(姓名和角色)
  - 刪除用戶功能(帶確認對話框)
  - 權限控制，僅允許管理員訪問
