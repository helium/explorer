import useSWR from 'swr'
import { useState, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import client, { TAKE_MAX } from './client'

export const fetchLatestBlocks = async (count = 100) => {
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

export const fetchBlockHeight = async () => {
  return client.blocks.getHeight()
}

export const useBlockHeight = (initialData) => {
  const { data, error } = useSWR('blockHeight', fetchBlockHeight, {
    initialData,
    refreshInterval: 10000,
  })
  return {
    height: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchBlock = async (height) => {
  const block = await client.blocks.get(height)
  return block
}

export const fetchBlockTxns = async (height) => {
  const txns = await (await client.block(height).transactions.list()).take(
    TAKE_MAX,
  )
  return txns
}

export const useFetchBlocks = (pageSize = 20) => {
  const [list, setList] = useState()
  const [results, setResults] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useAsync(async () => {
    const newList = await client.blocks.list()
    setList(newList)
    setIsLoadingInitial(false)
  }, [])

  useAsync(async () => {
    if (!list) return
    setIsLoadingMore(true)
    const newResults = await list.take(pageSize)
    setResults(newResults)
    setIsLoadingMore(false)
    if (newResults.length < pageSize) {
      setHasMore(false)
    }
  }, [list])

  const fetchMore = useCallback(async () => {
    const newResults = await list.take(pageSize)
    setResults([...results, ...newResults])
  }, [list, pageSize, results])

  return { results, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}

export const fetchHeightByTimestamp = async (timestamp) => {
  return client.blocks.getHeight({ maxTime: timestamp })
}
