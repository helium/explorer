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

const fetchMoreNearbyHotspots = async (lat, lon, distance, cursor) => {
  const params = qs.stringify({ lat, lon, distance, cursor })
  const url = 'https://api.helium.io/v1/hotspots/location/distance?' + params
  const response = await fetch(url)
  const moreNearbyHotspots = await response.json()
  return moreNearbyHotspots
}

export const fetchNearbyHotspots = async (lat, lon, distance = 1000) => {
  if (!lat || !lon) return []
  const params = qs.stringify({ lat, lon, distance })
  const url = 'https://api.helium.io/v1/hotspots/location/distance?' + params
  const response = await fetch(url)
  const hotspotsResponse = await response.json()
  const { data: hotspots } = hotspotsResponse

  let { cursor } = hotspotsResponse
  while (cursor !== undefined) {
    // if API returns a cursor, there are more than 500 hotspots and a cursor for the next set, so fetch the rest of them
    const moreNearbyHotspots = await fetchMoreNearbyHotspots(
      lat,
      lon,
      distance,
      cursor,
    )
    // very important to update the cursor to the one returned by the next request so we don't cause an infinite loop
    cursor = moreNearbyHotspots.cursor
    hotspots.push(...moreNearbyHotspots.data)
  }
  return hotspots
}

export const fetchHotspot = async (address) => {
  const client = new Client()
  const hotspot = await client.hotspots.get(address)
  return JSON.parse(JSON.stringify(hotspot))
}
