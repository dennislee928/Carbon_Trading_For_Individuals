// next.config.development.ts
import type { NextConfig } from "next";
import baseConfig from "./next.config";

const devConfig: NextConfig = {
  ...baseConfig,
  // Development-specific overrides
  reactStrictMode: true,
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

// Check if we're in development mode
const config = process.env.NODE_ENV === "development" ? devConfig : baseConfig;

export default config;
