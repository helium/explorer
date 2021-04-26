const { Client, Network } = require('@helium/http')
const { countBy, round, uniqBy } = require('lodash')
const { sub, compareAsc, getUnixTime } = require('date-fns')
const { Sample } = require('redis-time-series-ts')
const { redisClient } = require('../commonjs/redisTimeSeries')

const backfillHotspotsCount = async () => {
  const client = new Client(Network.staging)
  const hotspots = await (await client.hotspots.list()).take(200000)

  const now = new Date()

  console.log(getUnixTime(now), hotspots.length)

  await redisClient.add(
    new Sample('hotspots_count', hotspots.length, now),
    [],
    0,
  )

  await Promise.all(
    Array.from({ length: 364 }, async (x, i) => {
      const date = sub(now, { days: i + 1 })
      // count hotspots where the time added is earlier than the given date
      const count = countBy(
        hotspots,
        (h) => compareAsc(new Date(h.timestampAdded), date) === -1,
      ).true

      return redisClient.add(
        new Sample('hotspots_count', count, date),
        [],
        3600,
      )
    }),
  )
}

const generateStats = async () => {
  const client = new Client(Network.staging)
  const hotspots = await (await client.hotspots.list()).take(200000)
  const hotspotsCount = hotspots.length
  const onlineHotspotsCount = countBy(hotspots, 'status.online')?.online
  const onlinePct = round(onlineHotspotsCount / hotspotsCount, 4)
  const ownersCount = uniqBy(hotspots, 'owner').length
  const citiesCount = uniqBy(hotspots, 'geocode.cityId').length
  const countriesCount = uniqBy(hotspots, 'geocode.shortCountry').length

  const now = new Date()

  await redisClient.add(new Sample('hotspots_count', hotspotsCount, now), [], 0)
  await redisClient.add(
    new Sample('hotspots_online_pct', onlinePct, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('hotspots_owners_count', ownersCount, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('hotspots_cities_count', citiesCount, now),
    [],
    0,
  )
  await redisClient.add(
    new Sample('hotspots_countries_count', countriesCount, now),
    [],
    0,
  )

  await redisClient.disconnect()
}

const run = async () => {
  await generateStats()
  return process.exit(0)
}

run()
