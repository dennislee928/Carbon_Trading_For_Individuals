/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // 移除重定向，因為我們已經重構了路由結構
};

module.exports = nextConfig;
