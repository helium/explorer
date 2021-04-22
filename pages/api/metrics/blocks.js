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
  const blockTime = await redis.range('block_time', range, undefined, agg)
  const blockTimes = await redis.range('block_times', range, undefined, agg)
  const electionTime = await redis.range('election_time', range, undefined, agg)
  const electionTimes = await redis.range(
    'election_times',
    range,
    undefined,
    agg,
  )
  const txnRate = await redis.range('txn_rate', range, undefined, agg)
  const height = await redis.range('height', range, undefined, agg)

  await redis.disconnect()

  res.status(200).send({
    blockCount,
    blockTime,
    blockTimes,
    electionTime,
    electionTimes,
    txnRate,
    height,
  })
}
