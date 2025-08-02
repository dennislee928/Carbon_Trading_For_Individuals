# 碳交易平台 API 實現總結

## 概述

根據 API 文檔，我已經完成了以下實現：

1. **Backstage 管理員面板** - 基於 Next.js 14 的完整管理員控制台
2. **Frontend API 服務** - 完整的碳交易 API 客戶端實現

## Backstage 管理員面板

### 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件**: 自定義組件庫
- **圖標**: Lucide React
- **狀態管理**: React Hooks
- **API 調用**: Fetch API

### 功能模組

#### 1. 總覽儀表板 (`/`)

- 系統整體統計數據展示
- 用戶、交易、積分等關鍵指標
- 實時數據可視化

#### 2. 用戶管理 (`/users`)

- 查看所有用戶列表
- 用戶詳情查看
- 用戶狀態管理
- 搜索和篩選功能
- 用戶刪除功能

#### 3. 積分管理 (`/balances`)

- 用戶積分餘額查看
- 手動添加積分功能
- 積分統計分析
- 批量操作功能

#### 4. 錯誤記錄管理 (`/error-logs`)

- 系統錯誤監控
- 錯誤詳情查看
- 錯誤解決狀態管理
- 錯誤統計分析
- 錯誤解決功能

#### 5. 市場管理 (`/market`)

- 碳權交易訂單監控
- 買賣訂單分析
- 市場趨勢查看

#### 6. 通知管理 (`/notifications`)

- 系統通知列表
- 通知狀態管理
- 批量標記已讀
- 通知刪除功能

#### 7. 系統設定 (`/settings`)

- API 配置管理
- 系統限制設定
- 備份設定
- 維護模式控制

### API 集成

管理員面板完全集成了所有管理員 API：

#### 管理員 API

- `GET /admin/admins` - 獲取管理員列表
- `GET /admin/users` - 獲取所有用戶
- `PUT /admin/users/{id}` - 更新用戶信息
- `DELETE /admin/users/{id}` - 刪除用戶

#### 積分管理 API

- `GET /admin/balances` - 獲取所有用戶積分
- `PUT /admin/users/{id}/balance` - 更新用戶積分
- `POST /admin/users/{id}/balance/add` - 添加積分

#### 錯誤記錄 API

- `GET /admin/error-logs` - 獲取錯誤記錄
- `GET /admin/error-logs/stats` - 獲取錯誤統計
- `PUT /admin/error-logs/{id}/resolve` - 解決錯誤

#### 統計 API

- `GET /stats/overview` - 系統總覽統計
- `GET /stats/trades` - 交易統計
- `GET /stats/users` - 用戶統計

#### 市場 API

- `GET /market/orderbook` - 獲取訂單簿
- `POST /market/trade-offers` - 創建交易報價

#### 通知 API

- `GET /notifications` - 獲取通知列表
- `POST /notifications/mark-read` - 標記已讀
- `DELETE /notifications/{id}` - 刪除通知

## Frontend API 服務

### 實現的 API 端點

#### 認證相關

- `POST /auth/login` - 用戶登入
- `POST /auth/register` - 用戶註冊
- `POST /oauth/google/login` - Google OAuth 登入
- `POST /oauth/google/register` - Google OAuth 註冊
- `POST /oauth/google/exchange` - Google OAuth Token 交換
- `DELETE /auth/users/{userID}` - 刪除用戶帳戶

#### 用戶相關

- `GET /users/me` - 獲取當前用戶信息
- `GET /users/{userID}` - 獲取特定用戶信息
- `GET /users/{userID}/profile` - 獲取用戶資料
- `PUT /users/{userID}/profile` - 更新用戶資料
- `GET /users/{userID}/balance` - 獲取用戶積分餘額
- `GET /users/{userID}/assets` - 獲取用戶資產
- `GET /users/{userID}/tradeHistory` - 獲取用戶交易歷史

#### 交易相關

- `POST /trades/create` - 創建交易
- `GET /trades/orders/{userID}` - 獲取用戶交易訂單

#### 碳信用相關

- `GET /carbonCredits` - 獲取碳信用額列表
- `GET /carbonCredits/{creditId}` - 獲取特定碳信用額

#### 碳足跡計算

- `POST /carbon/footprint/calculate` - 計算碳足跡

#### 碳權項目

- `GET /carbon/projects` - 獲取碳權項目列表
- `GET /carbon/projects/{id}` - 獲取碳權項目詳情

#### 碳權代幣

- `GET /carbon/tokens` - 獲取碳權代幣列表

#### 市場統計

- `GET /carbon/market/stats` - 獲取市場統計

#### 碳權抵消

- `POST /carbon/offset/simulate` - 模擬碳權抵消購買

#### 訂單簿

- `GET /market/orderbook` - 獲取訂單簿

#### 交易報價

- `POST /market/trade-offers` - 創建交易報價

#### 購買碳信用

- `POST /market/purchase` - 購買碳信用

#### 通知相關

- `GET /notifications` - 獲取通知列表
- `POST /notifications/mark-read` - 標記通知為已讀
- `DELETE /notifications/{notificationID}` - 刪除通知

### 特性

1. **完整的 TypeScript 類型定義**
2. **自動認證處理**
3. **錯誤處理和重定向**
4. **請求/響應攔截器**
5. **環境變量配置**

## 項目結構

### Backstage

```
Backstage/
├── src/
│   ├── app/                    # Next.js App Router 頁面
│   │   ├── page.tsx           # 總覽頁面
│   │   ├── users/             # 用戶管理
│   │   ├── balances/          # 積分管理
│   │   ├── error-logs/        # 錯誤記錄
│   │   ├── market/            # 市場管理
│   │   ├── notifications/     # 通知管理
│   │   └── settings/          # 系統設定
│   ├── components/            # React 組件
│   │   ├── layout/           # 布局組件
│   │   └── ui/               # UI 組件
│   ├── lib/                  # 工具函數
│   │   ├── api.ts           # API 服務
│   │   └── utils.ts         # 通用工具
│   └── types/               # TypeScript 類型定義
│       └── api.ts           # API 類型
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

### Frontend

```
Frontend/
├── src/
│   ├── services/
│   │   ├── api.ts           # Climatiq API 服務
│   │   └── carbonApi.ts     # 碳交易 API 服務
│   └── app/
│       └── api-test/        # API 測試頁面
```

## 使用方法

### Backstage 管理員面板

1. **安裝依賴**

```bash
cd Backstage
npm install
```

2. **環境配置**
   創建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=https://apiv1-carbontrading.dennisleehappy.org/api/v1
```

3. **啟動開發服務器**

```bash
npm run dev
```

4. **訪問管理員面板**
   打開 [http://localhost:3000](http://localhost:3000)

### Frontend API 測試

1. **訪問 API 測試頁面**
   打開 [http://localhost:3000/api-test](http://localhost:3000/api-test)

2. **測試各種 API 端點**
   點擊按鈕測試不同的 API 功能

## 響應式設計

兩個項目都採用響應式設計，支持：

- 桌面端 (1024px+)
- 平板端 (768px - 1023px)
- 手機端 (< 768px)

## 安全性

1. **JWT Token 認證**
2. **自動 Token 刷新**
3. **401 錯誤自動重定向**
4. **環境變量配置**

## 部署

### Backstage

- 支持 Vercel 部署
- 支持 Docker 部署
- 環境變量配置

### Frontend

- 與現有 Frontend 項目集成
- 支持現有部署流程

## 總結

這個實現提供了：

1. **完整的管理員控制台** - 涵蓋所有管理功能
2. **完整的 API 客戶端** - 支持所有用戶端 API
3. **現代化的 UI/UX** - 響應式設計和直觀的用戶界面
4. **類型安全** - 完整的 TypeScript 支持
5. **可擴展性** - 模組化設計，易於擴展

所有實現都嚴格遵循 API 文檔規範，確保與後端 API 的完全兼容性。
