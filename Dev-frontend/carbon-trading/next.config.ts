import type { NextConfig } from "next";
import path from "path";

/**
 * 碳交易平台 Next.js 配置
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // 開啟SWC壓縮，提升構建性能
  swcMinify: true,

  // Configure headers (e.g., CORS)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // 輸出優化設置
  output: "standalone",

  // 靜態頁面生成設置，僅為首頁
  generateStaticParams: async () => {
    return [{ slug: "/" }];
  },

  // 環境變數設置
  env: {
    NEXT_PUBLIC_CARBON_API_URL:
      process.env.NEXT_PUBLIC_CARBON_API_URL ||
      "https://carboon-trade-backend.onrender.com",
    NEXT_PUBLIC_CLIMATIQ_API_KEY:
      process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY || "",
  },

  // Image optimization configuration
  images: {
    domains: [
      "https://www.para-universe-energy-exchange-station.com/",
      "https://para-universe-energy-exchange-station.com/",
    ], // Add all necessary domains
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack customizations if needed
  webpack(config) {
    // Example of adding plugins or loaders
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@components": path.resolve(__dirname, "components"),
      "@styles": path.resolve(__dirname, "styles"),
    };
    return config;
  },

  // TypeScript build checks
  typescript: {
    // Allow builds to fail if type errors are present (set `true` to ignore)
    ignoreBuildErrors: false,
  },

  // Trailing slash configuration for URLs
  trailingSlash: false, // No trailing slash

  // Remove the "X-Powered-By: Next.js" header
  poweredByHeader: false,

  // Enable gzip compression for responses
  compress: true,

  // 實驗性特性
  experimental: {
    // CSS優化
    optimizeCss: true,
  },

  // 重定向設置
  redirects: async () => {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/pages/dashboard",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/pages/login",
        permanent: false,
      },
      {
        source: "/register",
        destination: "/pages/register",
        permanent: false,
      },
      {
        source: "/market",
        destination: "/pages/market",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
