import { useState, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import useSWR from 'swr'
import qs from 'qs'
import client, { TAKE_MAX } from './client'
import { fetchAll } from '../utils/pagination'
import camelcaseKeys from 'camelcase-keys'
import { haversineDistance } from '../utils/location'

export const fetchLatestHotspots = async (count = 20) => {
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

export const useHotspots = (context, address, pageSize = 20) => {
  const [list, setList] = useState()
  const [hotspots, setHotspots] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const makeList = () => {
    if (!context || !address) {
      return client.hotspots.list()
    }

    if (context === 'account') {
      return client.account(address).hotspots.list()
    }
  }

  useAsync(async () => {
    const newList = await makeList()
    setList(newList)
  }, [])

  useAsync(async () => {
    if (!list) return
    setIsLoadingMore(true)
    const newHotspots = await list.take(pageSize)
    setHotspots(newHotspots)
    setIsLoadingMore(false)
    setIsLoadingInitial(false)
    if (newHotspots.length < pageSize) {
      setHasMore(false)
    }
  }, [list])

  const fetchMore = useCallback(async () => {
    const newHotspots = await list.take(pageSize)
    setHotspots([...hotspots, ...newHotspots])
  }, [list, pageSize, hotspots])

  return { hotspots, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}
