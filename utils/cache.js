import Redis from 'ioredis'

let redisClient
if (process.env.REDIS_CLOUD_URL) {
  redisClient = new Redis(process.env.REDIS_CLOUD_URL)
}

export const getCache = async (key, fallback, opts = {}) => {
  const expires = opts.expires === undefined ? true : opts.expires
  const ttl = opts.ttl || 60

  if (redisClient) {
    const cachedValue = await redisClient.get(key)
    if (cachedValue) {
      return JSON.parse(cachedValue)
    }
  }

  const freshValue = await fallback()

  if (redisClient) {
    if (expires) {
      redisClient.set(key, JSON.stringify(freshValue), 'EX', ttl)
    } else {
      redisClient.set(key, JSON.stringify(freshValue))
    }
  }

  return fallback
}
