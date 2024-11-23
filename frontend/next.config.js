/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable telemetry
  typescript: {
    // During development you can disable this
    ignoreBuildErrors: false,
  },
  eslint: {
    // During development you can disable this
    ignoreDuringBuilds: false,
  },
  // Disable telemetry
  telemetry: false,
  env: {
    NEXT_PUBLIC_CLIMATIQ_API_URL: process.env.NEXT_PUBLIC_CLIMATIQ_API_URL,
    NEXT_PUBLIC_CLIMATIQ_API_KEY: process.env.NEXT_PUBLIC_CLIMATIQ_API_KEY,
  },
};

module.exports = nextConfig;
