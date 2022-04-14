module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:rest*',
        destination: '/api/:rest*',
      },
      {
        source: '/:any*',
        destination: '/',
      },
    ]
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: false,
        skipEmptyLines: true
      }
    })

    return config
  },
}
