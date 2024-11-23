/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable telemetry during build
  typescript: {
    // Handle TypeScript errors during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Handle ESLint errors during build
    ignoreDuringBuilds: false,
  },
  // Add any other necessary configurations
  env: {
    NEXT_PUBLIC_CLIMATIQ_API_URL: process.env.NEXT_PUBLIC_CLIMATIQ_API_URL,
    NEXT_PUBLIC_CLIMATIQ_API_KEY: process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY,
  },
};

module.exports = nextConfig;
