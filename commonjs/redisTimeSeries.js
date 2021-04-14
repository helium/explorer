const {
  TimestampRange,
  AggregationType,
  Aggregation,
  Sample,
  RedisTimeSeriesFactory,
} = require('redis-time-series-ts')
const { sub } = require('date-fns')

const REDIS_CLOUD_URL = process.env.REDIS_CLOUD_URL

const redisClient = () => {
  const [_url, username, password, host, port] = REDIS_CLOUD_URL.match(
    /^redis:\/\/(.*):(.*)@(.*):(\d*)$/,
  )
  const factory = new RedisTimeSeriesFactory({
    username,
    password,
    host,
    port,
  })
  return factory.create()
}

const TimeBucket = {
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  WEEK: 1000 * 60 * 60 * 24 * 7,
  MONTH: 1000 * 60 * 60 * 24 * 30,
}

const aggregation = () => new Aggregation(AggregationType.MAX, TimeBucket.DAY)

const timestampRange = () => {
  const now = new Date()
  return new TimestampRange(sub(now, { days: 30 }), now.getTime())
}

const getRange = async (key) => {
  const redis = redisClient()
  const now = new Date()
  const aggregation = new Aggregation(AggregationType.MAX, TimeBucket.DAY)
  const timestampRange = new TimestampRange(
    sub(now, { days: 30 }),
    now.getTime(),
  )
  const samples = await redis.range(key, timestampRange, undefined, aggregation)

  await redis.disconnect()

  return samples
}

module.exports = { redisClient, getRange, aggregation, timestampRange }
