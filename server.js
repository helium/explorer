const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const path = require('path')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const compression = require('compression')
const url = require('url')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
  console.log(`Node cluster master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    )
  })
} else {
  const app = next({ dir: '.', dev })
  const nextHandler = app.getRequestHandler()

  app.prepare().then(() => {
    const server = express()

    const pathToIndex = path.join(__dirname, '.next/server/pages/index.html')
    server.get('/', (req, res) => {
      const raw = fs.readFileSync(pathToIndex)
      console.log('raw', raw)
      const pageTitle = 'Homepage - Welcome to my page'
      const updated = raw.replace(
        '__PAGE_META_TAGS__',
        `<title>${pageTitle}</title>`,
      )
      res.send(updated)
    })

    if (!dev) {
      console.log('in production server config')
      server.enable('trust proxy')
      server.use(compression())

      // Enforce SSL & HSTS in production
      server.use((req, res, nextPlug) => {
        const proto = req.headers['x-forwarded-proto']
        if (proto === 'https') {
          res.set({
            'Strict-Transport-Security': 'max-age=31557600', // one-year
          })
          return nextPlug()
        }
        res.redirect(`https://${req.headers.host}${req.url}`)
      })
    }

    // Static files
    // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
    server.use(
      '/static',
      express.static(path.join(__dirname, 'static'), {
        maxAge: dev ? '0' : '365d',
      }),
    )

    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))

    // Default catch-all renders Next app
    server.get('*', (req, res) => {
      // res.set({
      //   'Cache-Control': 'public, max-age=3600'
      // });
      const parsedUrl = url.parse(req.url, true)
      const { pathname, query } = parsedUrl
      console.log('pathname', pathname)
      console.log('query', query)
      nextHandler(req, res, parsedUrl)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`Listening on http://localhost:${port}`)
    })
  })
}
