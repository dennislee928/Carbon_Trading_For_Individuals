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
  // 添加 CORS 配置
  async headers() {
    return [
      {
        // 為所有 API 路由添加 CORS 標頭
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
