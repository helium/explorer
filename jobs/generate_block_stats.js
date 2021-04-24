const { Client, Network } = require('@helium/http')
const { meanBy } = require('lodash')
const { Sample } = require('redis-time-series-ts')
const { redisClient } = require('../commonjs/redisTimeSeries')
const fetch = require('node-fetch')

const generateBlockStats = async () => {
  const now = new Date()

  const client = new Client(Network.staging)
  const latestBlocks = await (await client.blocks.list()).take(100)
  const stats = await client.stats.get()

  const blocksCount = stats.counts.blocks
  // TODO this is longer in this stats endpoint
  // const longFiData = (stats.dataCredits * 24) / 10e8

  const blockTimeDay = stats.blockTimes.lastDay.avg
  const blockTimeDayStdDev = stats.blockTimes.lastDay.stddev

  const blockTimeWeek = stats.electionTimes.lastWeek.avg
  const blockTimeWeekStdDev = stats.electionTimes.lastWeek.stddev

  const blockTimeMonth = stats.electionTimes.lastMonth.avg
  const blockTimeMonthStdDev = stats.electionTimes.lastMonth.stddev

  const electionTimeDay = stats.electionTimes.lastDay.avg

  const txnRate = meanBy(latestBlocks, 'transactionCount')

  const heightRes = await fetch('https://api.helium.io/v1/blocks/height')
  const {
    data: { height },
  } = await heightRes.json()

  await redisClient.add(new Sample('blocks_count', blocksCount, now), [], 0)
  // await redisClient.add(new Sample('longfi_data', longFiData, now), [], 0)
  await redisClient.add(
    new Sample('election_time_day', electionTimeDay, now),
    [],
    0,
  )
  await redisClient.add(new Sample('block_time_day', blockTimeDay, now), [], 0)
  await redisClient.add(
    new Sample('block_time_day_std_dev', blockTimeDayStdDev, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('block_time_week', blockTimeWeek, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('block_time_week_std_dev', blockTimeWeekStdDev, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('block_time_month', blockTimeMonth, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('block_time_month_std_dev', blockTimeMonthStdDev, now),
    [],
    0,
  )

  await redisClient.add(new Sample('txn_rate', txnRate, now), [], 0)
  await redisClient.add(new Sample('height', height, now), [], 0)

  await redisClient.disconnect()
}

const run = async () => {
  await generateBlockStats()
  return process.exit(0)
}

run()
