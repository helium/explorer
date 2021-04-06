const Redis = require('ioredis')

let redisClient
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false },
  })
}

const setCache = async (key, value) => {
  if (!redisClient) return
  await redisClient.set(key, JSON.stringify(value))
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

module.exports = { setCache, getCache }
