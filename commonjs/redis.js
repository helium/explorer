const Redis = require('ioredis')

let redisClient
if (process.env.REDIS_TLS_URL) {
  redisClient = new Redis(process.env.REDIS_TLS_URL)
}

export const setCache = async (key, value) => {
  if (!redisClient) return
  await redisClient.set(key, JSON.stringify(value))
}

export const getCache = async (key, fallback) => {
  if (redisClient) {
    const cachedValue = await redisClient.get(key)
    if (cachedValue) {
      return JSON.parse(cachedValue)
    }
  }

  return fallback()
}
