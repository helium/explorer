// const withImages = require('next-images')
// const withCSS = require('@zeit/next-css')
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// withCss required since react-mapbox-gl imports CSS directly within node_modules
module.exports = {
  // ...withBundleAnalyzer(
  //   // withCSS(
  //   // withImages({
  //   {
  //     css: {
  //       importAsGlobal: true,
  //     },
  //   },
  //   // }),
  //   // ),
  // ),
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
