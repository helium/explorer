import { getCoverage } from '../../commonjs/coverage'
import Redis from 'ioredis'

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

  return fallback()
}

export default async function handler(req, res) {
  const coverage = await getCache('coverage', getCoverage)
  res.status(200).send(coverage)
}
