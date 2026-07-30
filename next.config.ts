import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 1280, 1920, 2880, 3840],
    formats: ["image/webp"],
    localPatterns: [
      {
        pathname: "/_next/static/media/**",
        search: "",
      },
    ],
    minimumCacheTTL: 31_536_000,
    qualities: [75],
  },
}

export default nextConfig
