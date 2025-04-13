# 個人碳交易平台

個人碳交易平台是一個專為個人用戶設計的碳交易和管理系統，允許用戶購買、出售和追蹤碳信用額。該平台旨在幫助個人減少碳足跡，參與全球氣候變化減緩行動。

## 功能特點

- 用戶註冊和認證系統
- 碳信用額交易市場
- 個人資產管理
- 交易歷史記錄
- 直觀的儀表板界面

## 開發技術

- **前端**: Next.js, React, TailwindCSS, TypeScript
- **UI 組件**: 整合了 Shadcn UI 和自定義組件
- **API 整合**: 使用 Axios 與后端 API 交互

## 項目結構

```
src/
├── app/                   # Next.js App目錄
│   ├── components/        # 共享UI組件
│   │   ├── UI/            # 基礎UI組件
│   │   └── theme-provider.tsx  # 主題提供者
│   ├── pages/             # 應用頁面
│   │   ├── dashboard.tsx  # 儀表板頁面
│   │   ├── login.tsx      # 登入頁面
│   │   ├── market.tsx     # 交易市場頁面
│   │   ├── register.tsx   # 註冊頁面
│   │   └── trades/        # 交易相關頁面
│   ├── services/          # API服務
│   │   ├── api.ts         # Climatiq API客戶端
│   │   ├── carbonApi.ts   # 碳交易API客戶端
│   │   └── types.ts       # 類型定義
│   ├── config/            # 配置文件
│   ├── layout.tsx         # 主布局
│   └── page.tsx           # 首頁
└── public/                # 靜態資源
```

## 安裝和運行

1. 克隆代碼庫

```bash
git clone https://github.com/yourusername/carbon-trading-platform.git
cd carbon-trading-platform
```

2. 安裝依賴

```bash
npm install
# 或者
yarn
```

3. 運行開發服務器

```bash
npm run dev
# 或者
yarn dev
```

4. 構建生產版本

```bash
npm run build
# 或者
yarn build
```

## API 整合

本項目整合了兩個主要 API:

1. **Climatiq API**: 用於計算碳排放量和獲取排放因子
2. **Carbon Trading API**: 用於處理用戶註冊、認證和碳信用額交易

API 客戶端位於`src/app/services/`目錄中。

## 貢獻

歡迎提交問題和拉取請求。對於重大更改，請先開一個 issue 討論您想要更改的內容。

## 授權

[MIT](https://choosealicense.com/licenses/mit/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## next step:

- only registered and login can use data 20.20
