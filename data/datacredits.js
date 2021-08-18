import useSWR from 'swr'
import client from './client'

export const fetchDataCredits = async () => {
  const stats = await client.stats.dcBurns()

  return {
    totalDay: stats.lastDay.total,
    totalWeek: stats.lastWeek.total,
    totalMonth: stats.lastMonth.total,
  }
}

export const useDataCredits = (initialData) => {
  const { data, error } = useSWR('dataCredits', fetchDataCredits, {
    initialData,
    refreshInterval: 10000,
  })

  return {
    dataCredits: data,
    isLoading: !error && !data,
    isError: error,
  }
}
