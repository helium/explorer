const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
const withPreact = require('next-plugin-preact')

// withCss required since react-mapbox-gl imports CSS directly within node_modules
module.exports = withPreact(
  withCSS(
    withImages({
      css: {
        importAsGlobal: true,
      },
    }),
  ),
)
