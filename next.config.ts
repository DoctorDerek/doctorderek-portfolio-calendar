import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/benjamin-patin-dOzoyaYjCbM-unsplash-1920.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2678400",
          },
        ],
      },
    ]
  },
}

export default nextConfig
