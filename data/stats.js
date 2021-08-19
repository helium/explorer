import useSWR from 'swr'
import client from './client'

export const fetchStats = async () => {
  const stats = await client.stats.get()

  return {
    circulatingSupply: stats.tokenSupply,
    blockTime: stats.blockTimes.lastDay.avg,
    blockTimes: stats.blockTimes,
    challenges: stats.counts.challenges,
    consensusGroups: stats.counts.consensusGroups,
    electionTime: stats.electionTimes.lastDay.avg,
    electionTimes: stats.electionTimes,
    totalHotspots: stats.counts.hotspots,
    totalBlocks: stats.counts.blocks,
    totalCities: stats.counts.cities,
    totalCountries: stats.counts.countries,
  }
}

export const useStats = (initialData) => {
  const { data, error } = useSWR('stats', fetchStats, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchCitiesByOnline = async (count = 20) => {
  return (await client.cities.list({ order: 'onlineCount' })).take(count)
}

export const fetchCitiesByTotal = async (count = 20) => {
  return (await client.cities.list({ order: 'hotspotCount' })).take(count)
}
