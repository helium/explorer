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
  if (redisClient) {
    redisClient.set(key, JSON.stringify(freshValue), 'EX', TTL)
  }
  return freshValue
}

const getCoverage = async () => {
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

  return coverage
}

export default async function handler(req, res) {
  const coverage = await getCache('coverage', getCoverage)
  res.status(200).send(coverage)
}
