const {
  redisClient,
  timestampRange,
  aggregation,
} = require('../../../../commonjs/redisTimeSeries')

export default async function handler(req, res) {
  const redis = redisClient()
  const range = timestampRange()
  const agg = aggregation()
  const count = await redis.range('hotspots_count', range, undefined, agg)
  const onlinePct = await redis.range(
    'hotspots_online_pct',
    range,
    undefined,
    agg,
  )
  const ownersCount = await redis.range(
    'hotspots_owners_count',
    range,
    undefined,
    agg,
  )
  const citiesCount = await redis.range(
    'hotspots_cities_count',
    range,
    undefined,
    agg,
  )
  const countriesCount = await redis.range(
    'hotspots_countries_count',
    range,
    undefined,
    agg,
  )

  await redis.disconnect()

  res
    .status(200)
    .send({ count, onlinePct, ownersCount, citiesCount, countriesCount })
}
