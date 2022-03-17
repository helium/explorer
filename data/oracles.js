import { isBefore, subDays } from 'date-fns'
import useSWR from 'swr'
import client from './client'

export const fetchOraclePrices = async () => {
  const timeLimit = subDays(new Date(), 30)
  const prices = []
  const list = await client.oracle.listPrices()

  try {
    for await (const oraclePrice of list) {
      if (isBefore(new Date(oraclePrice.timestamp), timeLimit)) break

      prices.push(oraclePrice)
    }
  } catch (e) {
    console.error(e)
  }
  return prices
}

export const useOraclePrices = (initialData) => {
  const fetcher = () => fetchOraclePrices()
  const { data, error } = useSWR('latestOraclePrices', fetcher, {
    initialData,
    refreshInterval: 60000,
  })
  return {
    oraclePrices: data,
    isLoading: !error && !data,
    isError: error,
  }
}
