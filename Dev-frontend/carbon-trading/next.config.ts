import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure headers (e.g., CORS)
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
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

  // Configure redirects (example included)
  async redirects() {
    return [
      {
        source: "/old-route",
        destination: "/new-route",
        permanent: true, // Indicates a 301 redirect
      },
    ];
  },

  // Configure rewrites for API proxying
  async rewrites() {
    return [
      {
        source: "/api/climatiq/:path*",
        destination: "https://api.climatiq.io/:path*",
      },
    ];
  },

  // Environment variables configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIMATIQ_API_KEY: process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY,
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

  // Optimize serverless output
  output: "standalone",

  // Trailing slash configuration for URLs
  trailingSlash: false, // No trailing slash

  // Remove the "X-Powered-By: Next.js" header
  poweredByHeader: false,

  // Enable gzip compression for responses
  compress: true,

  // Experimental features (if required)
  experimental: {
    optimizeCss: true, // Minimize CSS during builds
  },
};

export default nextConfig;
