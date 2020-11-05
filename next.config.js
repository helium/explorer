const withImages = require('next-images')
const withCSS = require('@zeit/next-css')

// withCss required since react-mapbox-gl imports CSS directly within node_modules
module.exports = withCSS(
  withImages({
    css: {
      importAsGlobal: true,
    },
  }),
)
