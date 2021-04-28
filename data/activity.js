import { useCallback, useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from './client'

export const useHotspotActivity = (address, pageSize = 20) => {
  const [list, setList] = useState()
  const [transactions, setTransactions] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useAsync(async () => {
    const newList = await client.hotspot(address).activity.list()
    setList(newList)
  }, [address])

  useAsync(async () => {
    if (!list) return
    setIsLoadingMore(true)
    const newTransactions = await list.take(pageSize)
    setTransactions(newTransactions)
    setIsLoadingMore(false)
    setIsLoadingInitial(false)
    if (newTransactions.length < pageSize) {
      setHasMore(false)
    }
  }, [list])

  const fetchMore = useCallback(async () => {
    const newTransactions = await list.take(pageSize)
    setTransactions([...transactions, ...newTransactions])
  }, [list, pageSize, transactions])

  return { transactions, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}

export const useFetchList = (selector, fetchType, pageSize = 20) => {
  const [list, setList] = useState()
  const [results, setResults] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useAsync(async () => {
    let newList
    switch (fetchType) {
      case 'hotspot.activity': {
        newList = await client.hotspot(selector).activity.list()
        break
      }
      case 'blocks': {
        newList = await client.blocks.list()
        break
      }
      case 'block.transactions': {
        newList = await client.block(selector).transactions.list()
        break
      }
    }
    setList(newList)
    setIsLoadingInitial(false)
  }, [selector])

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
