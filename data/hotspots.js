import useSWR from 'swr'
import Client from '@helium/http'
import qs from 'qs'

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

export const fetchHotspotsStats = async () => {
  const response = await fetch('/api/metrics/hotspots')
  return response.json()
}

export const useHotspotsStats = (initialData) => {
  const { data, error } = useSWR('latestHotspots', fetchHotspotsStats, {
    initialData,
    refreshInterval: 60000,
  })
  return {
    hotspotsStats: data,
    isLoading: !error && !data,
    isError: error,
  }
}

const MAX = 100000
const client = new Client()

export const getHotspotRewardsSum = async (address, numDaysBack) => {
  const initialDate = new Date()
  const endDate = new Date()
  endDate.setDate(initialDate.getDate() - numDaysBack)
  return client.hotspot(address).rewards.sum.get(endDate, initialDate)
}

export const getHotspotRewardsBuckets = async (
  address,
  numBack,
  bucketType,
) => {
  const list = await client.hotspot(address).rewards.sum.list({
    minTime: `-${numBack} ${bucketType}`,
    maxTime: new Date(),
    bucket: bucketType,
  })
  const rewards = await list.take(MAX)
  return rewards
}

export const fetchNearbyHotspots = async (lat, lng, dist = 1000) => {
  if (!lat || !lng) return []
  const params = qs.stringify({ lat, lng, dist })
  const url = 'https://wallet.api.helium.systems/api/v1/hotspots?' + params
  const response = await fetch(url)
  const hotspots = await response.json()
  return hotspots
}

export const fetchHotspot = async (address) => {
  const client = new Client()
  const hotspot = await client.hotspots.get(address)
  return JSON.parse(JSON.stringify(hotspot))
}
