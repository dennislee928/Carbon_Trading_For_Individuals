/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CLIMATIQ_API_KEY: process.env.CLIMATIQ_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
