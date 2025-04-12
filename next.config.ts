/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/pages/Login",
        permanent: false,
      },
      {
        source: "/register",
        destination: "/pages/Register",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/pages/Dashboard",
        permanent: false,
      },
      {
        source: "/market",
        destination: "/pages/Market",
        permanent: false,
      },
      {
        source: "/trades",
        destination: "/pages/Trades",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
