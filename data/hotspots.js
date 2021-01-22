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
    bucket: 'hour',
  })
  const url = `https://api.helium.io/v1/hotspots/${address}/rewards/stats?${params}`
  const response = await fetch(url)
  const { data } = await response.json()

  const day = sumBy(data.slice(0, 23), 'total')
  const previousDay = sumBy(data.slice(23, 47), 'total')
  const week = sumBy(data.slice(0, 24 * 7 - 1), 'total')
  const previousWeek = sumBy(data.slice(24 * 7 - 1, 24 * 7 * 2), 'total')
  const month = sumBy(data.slice(0, 24 * 30 - 1), 'total')
  const previousMonth = sumBy(data.slice(24 * 30 - 1, 24 * 30 * 2), 'total')

  const dataToSplit = data
  const half = Math.ceil(dataToSplit.length / 2)
  const firstMonthHours = dataToSplit.splice(0, half)
  const secondMonthHours = dataToSplit.splice(-half)

  return {
    day,
    previousDay,
    week,
    previousWeek,
    month,
    previousMonth,
    firstMonthHours,
    secondMonthHours,
  }
}
