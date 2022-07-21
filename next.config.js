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
  async redirects() {
    return [
      {
        source: '/hotspots',
        destination: '/iot',
        permanent: false,
      },
      {
        source: '/hotspots/hex/:index',
        destination: '/iot/hex/:index',
        permanent: false,
      },
      {
        source: '/hotspots/cities/:cityid',
        destination: '/iot/cities/:cityid',
        permanent: false,
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
        skipEmptyLines: true,
      },
    })

    return config
  },
}
