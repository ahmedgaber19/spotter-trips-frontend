/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  },
  // Allow external images and optimize bundle
  images: {
    domains: ["localhost", "vercel.app"],
  },
  // Configure for Vercel deployment
  trailingSlash: false,
  reactStrictMode: true,

  // Handle CSS imports properly
  transpilePackages: ["@mui/material", "@mui/system", "@mui/icons-material"],

  // Vercel-specific optimizations
  experimental: {
    outputStandalone: true,
  },

  // Optimize for production
  compress: true,
  poweredByHeader: false,

  // Handle API routes for development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        }/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
