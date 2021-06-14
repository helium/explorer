import useSWR from 'swr'

export const fetchDataCredits = async () => {
  const response = await fetch('https://api.helium.io/v1/dc_burns/stats')
  const dcStats = await response.json()

  return {
    totalDay: dcStats.data.last_day.total,
    totalWeek: dcStats.data.last_week.total,
    totalMonth: dcStats.data.last_month.total,
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
