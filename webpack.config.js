module.exports = {
  target: 'webworker',
  entry: './workers/ai-service.ts',
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "base64-js": require.resolve("base64-js"),
      "mustache": require.resolve("mustache")
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
} 