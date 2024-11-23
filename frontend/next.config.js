/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  telemetry: false,
  typescript: {
    // Enable this only if you need to deploy with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Enable this only if you need to deploy with lint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
