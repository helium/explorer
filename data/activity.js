import { useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from './client'

export const useActivity = (context, address, filters = [], pageSize = 20) => {
  const [list, setList] = useState()
  const [transactions, setTransactions] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useAsync(async () => {
    let newList
    switch (context) {
      case 'hotspot':
        newList = await client.hotspot(address).roles.list({ filterTypes: filters })
        break
      case 'account':
        newList = await client.account(address).roles.list({ filterTypes: filters })
        break
      case 'validator':
        newList = await client.validator(address).roles.list({ filterTypes: filters })
        break
      default:
        return
    }
    setList(newList)
  }, [address, filters, context])

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
  }, [list, pageSize])

  useEffect(() => {
    setIsLoadingInitial(true)
    setHasMore(true)
    setIsLoadingMore(true)
  }, [filters])

  const fetchMore = useCallback(async () => {
    const newTransactions = await list.take(pageSize)
    setTransactions([...transactions, ...newTransactions])
  }, [list, pageSize, transactions])

  return { transactions, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}
