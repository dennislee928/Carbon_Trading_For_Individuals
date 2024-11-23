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
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

module.exports = nextConfig;
