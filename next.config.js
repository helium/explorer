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
}
