const { Client } = require('@helium/http')
const geoJSON = require('geojson')
const Redis = require('ioredis')

const TTL = process.env.REDIS_TTL || 60 // seconds

let redisClient
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL)
}

const getCache = async (key, fallback) => {
  if (redisClient) {
    const cachedValue = await redisClient.get(key)
    if (cachedValue) {
      return JSON.parse(cachedValue)
    }
  }

  const freshValue = await fallback()

  return freshValue
}

const getCoverage = async () => {
  const client = new Client()
  const allHotspots = await (await client.hotspots.list()).takeJSON(100000)
  const hotspots = allHotspots.map((h) => ({
    ...h,
    location: [h.geocode.longCity, h.geocode.shortState].join(', '),
    status: h.status.online,
  }))

  const [onlineHotspots, offlineHotspots] = hotspots.reduce(
    ([online, offline], hotspot) => {
      return hotspot.status === 'online'
        ? [[...online, hotspot], offline]
        : [online, [...offline, hotspot]]
    },
    [[], []],
  )

  const online = geoJSON.parse(onlineHotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

  const offline = geoJSON.parse(offlineHotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

  return { online, offline }
}

export default async function handler(req, res) {
  const coverage = await getCache('coverage', getCoverage)
  res.status(200).send(coverage)
}
