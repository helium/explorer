import useSWR from 'swr'
import Client from '@helium/http'

export const fetchLatestBlocks = async (count = 100) => {
  const client = new Client()
  const blocks = await (await client.blocks.list()).take(count)

  return JSON.parse(JSON.stringify(blocks))
}

export const useLatestBlocks = (initialData, count = 100) => {
  const fetcher = () => fetchLatestBlocks(count)
  const { data, error } = useSWR('latestBlocks', fetcher, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    latestBlocks: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchHeightByTimestamp = async (timestamp) => {
  const response = await fetch(
    `https://api.helium.io/v1/blocks/height?max_time=${timestamp}`,
  )
  const {
    data: { height },
  } = await response.json()
  return height
}
