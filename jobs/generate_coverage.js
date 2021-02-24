const Redis = require('ioredis')
const { getCoverage } = require('../pages/api/coverage')

const redisClient = new Redis(process.env.REDIS_URL)

const setCache = async (key, value) => {
  await redisClient.set(key, JSON.stringify(value))
}

const generateCoverage = async () => {
  await setCache('coverage', await getCoverage())

  return process.exit(0)
}

generateCoverage()
