const { Client, Network } = require('@helium/http')
const { countBy, round, uniqBy, meanBy } = require('lodash')
const { sub, compareAsc, getUnixTime } = require('date-fns')
const { Sample } = require('redis-time-series-ts')
const { redisClient } = require('../commonjs/redisTimeSeries')

const generateBlockStats = async () => {
  const redis = redisClient()

  const client = new Client(Network.staging)
  const latestBlocks = await (await client.blocks.list()).take(100)
  const stats = await client.stats.get()

  const counts = stats.counts.blocks
  const longFiData = (stats.dataCredits * 24) / 10e8

  const blockTimeDay = stats.blockTimes.lastDay.avg
  const blockTimeDayStdDev = stats.blockTimes.lastDay.stddev

  const blockTimeWeek = stats.electionTimes.lastWeek.avg
  const blockTimeWeekStdDev = stats.electionTimes.lastWeek.stddev

  const blockTimeMonth = stats.electionTimes.lastMont.avg
  const blockTimeMonthStdDev = stats.electionTimes.lastMonth.stddev

  const electionTimeDay = stats.electionTimes.lastDay.avg

  const txnRate = meanBy(latestBlocks, 'transactionCount')

  const heightRes = await fetch('https://api.helium.io/v1/blocks/height')
  const { data: height } = await heightRes.json()

  await redis.add(new Sample('blocks_count', counts, now), [], 0)
  await redis.add(new Sample('longfi_data', longFiData, now), [], 0)
  await redis.add(new Sample('election_time_day', electionTimeDay, now), [], 0)
  await redis.add(new Sample('block_time_day', blockTimeDay, now), [], 0)
  await redis.add(
    new Sample('block_time_day_std_dev', blockTimeDayStdDev, now),
    [],
    0,
  )
  await redis.add(new Sample('block_time_week', blockTimeWeek, now), [], 0)
  await redis.add(
    new Sample('block_time_week_std_dev', blockTimeWeekStdDev, now),
    [],
    0,
  )
  await redis.add(new Sample('block_time_month', blockTimeMonth, now), [], 0)
  await redis.add(
    new Sample('block_time_month_std_dev', blockTimeMonthStdDev, now),
    [],
    0,
  )

  await redis.add(new Sample('txn_rate', txnRate, now), [], 0)
  await redis.add(new Sample('height', height, now), [], 0)

  await redis.disconnect()
}

const run = async () => {
  await generateBlockStats()
  return process.exit(0)
}

run()
