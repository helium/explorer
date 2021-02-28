import useSWR from 'swr'
import Client from '@helium/http'

export const fetchStats = async () => {
  const client = new Client()
  const stats = await client.stats.get()

  return {
    circulatingSupply: stats.tokenSupply,
    blockTime: stats.blockTimes.lastDay.avg,
    blockTimes: stats.blockTimes,
    challenges: stats.counts.challenges,
    consensusGroups: stats.counts.consensusGroups,
    electionTime: stats.electionTimes.lastDay.avg,
    electionTimes: stats.electionTimes,
    packetsTransferred: stats.stateChannelCounts.lastMonth.numPackets,
    dataCredits: stats.stateChannelCounts.lastMonth.numDcs,
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
