const {
  redisClient,
  timestampRange,
  aggregation,
} = require('../../../commonjs/redisTimeSeries')

export default async function handler(req, res) {
  const redis = redisClient()
  const range = timestampRange()
  const agg = aggregation()

  const blockCount = await redis.range('blocks_count', range, undefined, agg)
  const longFiData = await redis.range('longfi_data', range, undefined, agg)
  const electionTimeDay = await redis.range(
    'election_time_day',
    range,
    undefined,
    agg,
  )
  const blockTimeDay = await redis.range(
    'block_time_day',
    range,
    undefined,
    agg,
  )
  const blockTimeDayStdDev = await redis.range(
    'block_time_day_std_dev',
    range,
    undefined,
    agg,
  )
  const blockTimeWeek = await redis.range(
    'block_time_week',
    range,
    undefined,
    agg,
  )
  const blockTimeWeekStdDev = await redis.range(
    'block_time_week_std_dev',
    range,
    undefined,
    agg,
  )
  const blockTimeMonth = await redis.range(
    'block_time_month',
    range,
    undefined,
    agg,
  )
  const blockTimeMonthStdDev = await redis.range(
    'block_time_month_std_dev',
    range,
    undefined,
    agg,
  )

  const txnRate = await redis.range('txn_rate', range, undefined, agg)
  const height = await redis.range('height', range, undefined, agg)

  await redis.disconnect()

  res.status(200).send({
    blockCount,
    longFiData,
    electionTimeDay,
    blockTimeDay,
    blockTimeDayStdDev,
    blockTimeWeek,
    blockTimeWeekStdDev,
    blockTimeMonth,
    blockTimeMonthStdDev,
    txnRate,
    height,
  })
}
