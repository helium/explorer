const withImages = require('next-images')
const withCSS = require('@zeit/next-css')

module.exports = withCSS(
  withImages({
    css: {
      importAsGlobal: true,
    },
  }),
)
