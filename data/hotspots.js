import useSWR from 'swr'
import Client from '@helium/http'
import qs from 'qs'
import client, { TAKE_MAX } from './client'
import { fetchAll } from '../utils/pagination'
import camelcaseKeys from 'camelcase-keys'
import { haversineDistance } from '../utils/location'

export const fetchLatestHotspots = async (count = 20) => {
  const client = new Client()
  const hotspots = await (await client.hotspots.list()).take(count)

  return JSON.parse(JSON.stringify(hotspots))
}

export const useLatestHotspots = (initialData, count = 20) => {
  const fetcher = () => fetchLatestHotspots(count)
  const { data, error } = useSWR('latestHotspots', fetcher, {
    initialData,
    refreshInterval: 1000 * 60,
  })
  return {
    latestHotspots: data,
    isLoading: !error && !data,
    isError: error,
  }
}

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
  const rewards = await list.take(TAKE_MAX)
  return rewards
}

export const fetchNearbyHotspots = async (lat, lon, distance = 1000) => {
  if (!lat || !lon) return []
  const hotspots = await fetchAll('/hotspots/location/distance', {
    lat,
    lon,
    distance,
  })
  const hotspotsWithDistance = hotspots.map((h) => ({
    ...h,
    distance: haversineDistance(lon, lat, h.lng, h.lat) * 1000,
  }))
  return camelcaseKeys(hotspotsWithDistance)
}

export const fetchHotspot = async (address) => {
  const hotspot = await client.hotspots.get(address)
  return JSON.parse(JSON.stringify(hotspot))
}

export const fetchWitnesses = async (address) => {
  const list = await client.hotspot(address).witnesses.list()
  const witnesses = await list.take(TAKE_MAX)
  return witnesses
}
