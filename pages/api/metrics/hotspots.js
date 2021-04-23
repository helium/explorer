const {
  redisClient,
  timestampRange,
  aggregation,
} = require('../../../commonjs/redisTimeSeries')

export default async function handler(req, res) {
  const range = timestampRange()
  const agg = aggregation()
  const count = await redisClient.range('hotspots_count', range, undefined, agg)
  const onlinePct = await redisClient.range(
    'hotspots_online_pct',
    range,
    undefined,
    agg,
  )
  const ownersCount = await redisClient.range(
    'hotspots_owners_count',
    range,
    undefined,
    agg,
  )
  const citiesCount = await redisClient.range(
    'hotspots_cities_count',
    range,
    undefined,
    agg,
  )
  const countriesCount = await redisClient.range(
    'hotspots_countries_count',
    range,
    undefined,
    agg,
  )

  res
    .status(200)
    .send({ count, onlinePct, ownersCount, citiesCount, countriesCount })
}
