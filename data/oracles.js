import useSWR from 'swr'
import fetch from 'node-fetch'

// TODO add price list to helium-js #yolo
export const fetchLatestOraclePrices = async () => {
  const prices = []
  const response0 = await fetch('https://api.helium.io/v1/oracle/prices/')
  const { data: data0, cursor: cursor0 } = await response0.json()
  prices.push(...data0)
  const response1 = await fetch(
    `https://api.helium.io/v1/oracle/prices?cursor=${cursor0}`,
  )
  const { data: data1, cursor: cursor1 } = await response1.json()
  prices.push(...data1)
  const response2 = await fetch(
    `https://api.helium.io/v1/oracle/prices?cursor=${cursor1}`,
  )
  const { data: data2, cursor: cursor2 } = await response2.json()
  prices.push(...data2)
  const response3 = await fetch(
    `https://api.helium.io/v1/oracle/prices?cursor=${cursor2}`,
  )
  const { data: data3, cursor: cursor3 } = await response3.json()
  prices.push(...data3)
  const response4 = await fetch(
    `https://api.helium.io/v1/oracle/prices?cursor=${cursor3}`,
  )
  const { data: data4 } = await response4.json()
  prices.push(...data4)
  return prices
}

export const useLatestOraclePrices = (initialData) => {
  const fetcher = () => fetchLatestOraclePrices()
  const { data, error } = useSWR('latestOraclePrices', fetcher, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    latestOraclePrices: data,
    isLoading: !error && !data,
    isError: error,
  }
}
