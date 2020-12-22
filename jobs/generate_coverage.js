const { Client } = require('@helium/http')
const geoJSON = require('geojson')
const Redis = require('ioredis')

const redisClient = new Redis(process.env.REDIS_URL)

const setCache = async (key, value) => {
  await redisClient.set(key, JSON.stringify(value))
}

const generateCoverage = async () => {
  const client = new Client()
  const allHotspots = await (await client.hotspots.list()).takeJSON(100000)
  const hotspots = allHotspots.map((h) => ({
    ...h,
    location: [h.geocode.longCity, h.geocode.shortState].join(', '),
  }))

  const coverage = geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location'],
  })

  await setCache('coverage', coverage)

  return process.exit(0)
}

generateCoverage()
