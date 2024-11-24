/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
};

module.exports = {
  env: {
    CLIMATIQ_API_KEY: process.env.CLIMATIQ_API_KEY,
  },
};
