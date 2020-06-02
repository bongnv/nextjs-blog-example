module.exports = {
  experimental: {
    granularChunks: false,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(jpg|jpeg|png|svg|webp|gif|ico)$/,
      use: [
        "image-trace-loader",
        {
          loader: "file-loader",
          options: {
            outputPath: `${options.isServer ? '../' : ''}static/images/`,
            publicPath: "/_next/static/images",
          }
        },
        {
          loader: "image-webpack-loader",
          options: {
            disable: options.dev,
          }
        },
      ]
    })

    return config;
  }
};
