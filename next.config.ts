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

  webpack: (config, { dev, isServer, webpack }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next",
            name: "static/media/[name].[hash].[ext]",
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    config.plugins.push(
      new webpack.ProvidePlugin({
        React: "react",
      }),
    )

    return config
  },
}

export default nextConfig
