import useSWR from 'swr'
import Client from '@helium/http'
import fetch from 'node-fetch'
import { sub, formatISO } from 'date-fns'
import qs from 'qs'
import sumBy from 'lodash/sumBy'

export const fetchLatestHotspots = async (count = 20) => {
  const client = new Client()
  const hotspots = await (await client.hotspots.list()).take(count)

  return JSON.parse(JSON.stringify(hotspots))
}

export const useLatestHotspots = (initialData, count = 20) => {
  const fetcher = () => fetchLatestHotspots(count)
  const { data, error } = useSWR('latestHotspots', fetcher, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    latestHotspots: data,
    isLoading: !error && !data,
    isError: error,
  }
}

const convertDateToUTC = (date) =>
  new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )

// TODO add this to helium-js
export const fetchRewardsSummary = async (address) => {
  const now = new Date()
  const nowUTC = convertDateToUTC(now)
  // Use UTC version of current time so that the current day's rewards get included in the API response

  const monthAgo = sub(nowUTC, { days: 30 })
  const twoMonthsAgo = sub(monthAgo, { days: 30 })
  const params = qs.stringify({
    // since the ISO format of the dates will always be a known length, substr(0, 19) will lop off the offset from the end
    // this should only have an effect locally in the dev environment, because doing new Date() on Heroku won't have an offset
    min_time: formatISO(twoMonthsAgo).substr(0, 19),
    max_time: formatISO(nowUTC).substr(0, 19),
    bucket: 'day',
  })
  const url = `https://api.helium.io/v1/hotspots/${address}/rewards/sum?${params}`
  const response = await fetch(url)
  const { data } = await response.json()

  return {
    buckets: data,
    day: data[0].total,
    previousDay: data[1].total,
    week: sumBy(data.slice(0, 6), 'total'),
    previousWeek: sumBy(data.slice(6, 13), 'total'),
    month: sumBy(data.slice(0, 29), 'total'),
    previousMonth: sumBy(data.slice(29, 59), 'total'),
  }
}
