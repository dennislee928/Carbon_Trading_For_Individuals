# 碳交易管理員面板

這是一個基於 Next.js 14 和 TypeScript 構建的碳交易平台管理員控制台。

## 功能特色

### 📊 總覽儀表板

- 系統整體統計數據
- 用戶、交易、積分等關鍵指標
- 實時數據展示

### 👥 用戶管理

- 查看所有用戶列表
- 用戶詳情查看
- 用戶狀態管理
- 搜索和篩選功能

### 💰 積分管理

- 用戶積分餘額查看
- 手動添加積分
- 積分統計分析
- 批量操作功能

### 🚨 錯誤記錄管理

- 系統錯誤監控
- 錯誤詳情查看
- 錯誤解決狀態管理
- 錯誤統計分析

### 📈 市場管理

- 碳權交易訂單監控
- 買賣訂單分析
- 市場趨勢查看

### 🔔 通知管理

- 系統通知列表
- 通知狀態管理
- 批量標記已讀
- 通知刪除功能

### ⚙️ 系統設定

- API 配置管理
- 系統限制設定
- 備份設定
- 維護模式控制

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件**: 自定義組件庫
- **圖標**: Lucide React
- **狀態管理**: React Hooks
- **API 調用**: Fetch API

## 快速開始

### 安裝依賴

```bash
npm install
# 或
yarn install
```

### 環境配置

創建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=https://apiv1-carbontrading.dennisleehappy.org/api/v1
```

### 開發模式

```bash
npm run dev
# 或
yarn dev
```

打開 [http://localhost:3000](http://localhost:3000) 查看應用。

### 構建生產版本

```bash
npm run build
# 或
yarn build
```

### 啟動生產服務器

```bash
npm start
# 或
yarn start
```

## 項目結構

```
src/
├── app/                    # Next.js App Router 頁面
│   ├── page.tsx           # 總覽頁面
│   ├── users/             # 用戶管理
│   ├── balances/          # 積分管理
│   ├── error-logs/        # 錯誤記錄
│   ├── market/            # 市場管理
│   ├── notifications/     # 通知管理
│   └── settings/          # 系統設定
├── components/            # React 組件
│   ├── layout/           # 布局組件
│   └── ui/               # UI 組件
├── lib/                  # 工具函數
│   ├── api.ts           # API 服務
│   └── utils.ts         # 通用工具
└── types/               # TypeScript 類型定義
    └── api.ts           # API 類型
```

## API 集成

管理員面板與後端 API 完全集成，支持以下功能：

### 管理員 API

- `GET /admin/admins` - 獲取管理員列表
- `GET /admin/users` - 獲取所有用戶
- `PUT /admin/users/{id}` - 更新用戶信息
- `DELETE /admin/users/{id}` - 刪除用戶

### 積分管理 API

- `GET /admin/balances` - 獲取所有用戶積分
- `PUT /admin/users/{id}/balance` - 更新用戶積分
- `POST /admin/users/{id}/balance/add` - 添加積分

### 錯誤記錄 API

- `GET /admin/error-logs` - 獲取錯誤記錄
- `GET /admin/error-logs/stats` - 獲取錯誤統計
- `PUT /admin/error-logs/{id}/resolve` - 解決錯誤

### 統計 API

- `GET /stats/overview` - 系統總覽統計
- `GET /stats/trades` - 交易統計
- `GET /stats/users` - 用戶統計

### 市場 API

- `GET /market/orderbook` - 獲取訂單簿
- `POST /market/trade-offers` - 創建交易報價

### 通知 API

- `GET /notifications` - 獲取通知列表
- `POST /notifications/mark-read` - 標記已讀
- `DELETE /notifications/{id}` - 刪除通知

## 響應式設計

管理員面板採用響應式設計，支持：

- 桌面端 (1024px+)
- 平板端 (768px - 1023px)
- 手機端 (< 768px)

## 主題和樣式

使用 Tailwind CSS 進行樣式設計，支持：

- 淺色主題
- 深色主題（可擴展）
- 自定義顏色系統
- 一致的設計語言

## 開發指南

### 添加新頁面

1. 在 `src/app/` 下創建新的目錄
2. 添加 `page.tsx` 文件
3. 在 `Sidebar.tsx` 中添加導航項

### 添加新 API

1. 在 `src/types/api.ts` 中定義類型
2. 在 `src/lib/api.ts` 中添加 API 方法
3. 在頁面組件中使用

### 自定義組件

1. 在 `src/components/ui/` 下創建組件
2. 使用 TypeScript 和 Tailwind CSS
3. 遵循現有的組件模式

## 部署

### Vercel 部署

1. 連接 GitHub 倉庫到 Vercel
2. 設置環境變量
3. 自動部署

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 貢獻指南

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 許可證

MIT License

## 支持

如有問題或建議，請提交 Issue 或聯繫開發團隊。
