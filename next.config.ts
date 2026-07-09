import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/calendar",
        permanent: true,
      },
    ]
  },

  pageExtensions: ["js", "jsx", "ts", "tsx"],

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
