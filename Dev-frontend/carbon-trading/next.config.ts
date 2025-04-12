import type { NextConfig } from "next";
import path from "path";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    // 在產生生產構建時忽略 ESLint 的錯誤
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在產生生產構建時忽略 TypeScript 的錯誤
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // 允許從任何來源加載圖像
      { protocol: "https", hostname: "**" },
    ],
  },
  // 不使用 setupDevBindings，因為可能缺少依賴
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/pages/Login",
        permanent: false,
      },
      {
        source: "/register",
        destination: "/pages/Register",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/pages/Dashboard",
        permanent: false,
      },
      {
        source: "/market",
        destination: "/pages/Market",
        permanent: false,
      },
      {
        source: "/trades",
        destination: "/pages/Trades",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
