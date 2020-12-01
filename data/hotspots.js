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

// TODO add this to helium-js
export const fetchRewardsSummary = async (address) => {
  const now = new Date()
  const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  // Use UTC version of current time so that the current day's rewards get included in the API response

  const monthAgo = sub(now, { days: 30 })
  const params = qs.stringify({
    min_time: formatISO(monthAgo),
    max_time: formatISO(nowUTC),
    bucket: 'day',
  })
  const url = `https://api.helium.io/v1/hotspots/${address}/rewards/stats?${params}`
  const response = await fetch(url)
  const { data } = await response.json()

  return {
    day: data[0].total,
    week: sumBy(data.slice(0, 6), 'total'),
    month: sumBy(data, 'total'),
  }
}
