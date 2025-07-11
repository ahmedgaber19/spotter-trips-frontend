/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://spotter-trips-backend.vercel.app",
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
  output: "standalone",

  // Optimize for production
  compress: true,
  poweredByHeader: false,

  // Handle API routes for development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://spotter-trips-backend.vercel.app"
        }/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
