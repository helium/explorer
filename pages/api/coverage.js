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

const toGeoJSON = (hotspots) =>
  geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

const getCoverage = async () => {
  const client = new Client()
  const hotspots = await client.hotspots.list()
  const result = {
    unset: 0,
    online: [],
    offline: [],
  }

  for await (const { data } of hotspots) {
    const hotspot = {
      ...data,
      location: [data.geocode.longCity, data.geocode.shortState]
        .filter(Boolean)
        .join(', '),
      status: data.status.online,
    }

    if (!hotspot.lng || !hotspot.lat) {
      result.unset++
      continue
    }

    const isOnline = hotspot.status === 'online'
    result[isOnline ? 'online' : 'offline'].push(hotspot)
  }

  return {
    ...result,
    online: toGeoJSON(result.online),
    offline: toGeoJSON(result.offline),
  }
}

export default async function handler(req, res) {
  const coverage = await getCache('coverage', getCoverage)
  res.status(200).send(coverage)
}
