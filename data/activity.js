import { useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from './client'

const pickClientContext = (address, context) => {
  const clients = {
    hotspot: client.hotspot(address),
    account: client.account(address),
    validator: client.validator(address),
  }
  return clients[context]
}

export const useActivity = (context, address, filters = [], pageSize = 20) => {
  const [list, setList] = useState()
  const [transactions, setTransactions] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useAsync(async () => {
    const clientContext = pickClientContext(address, context)
    const newList = await clientContext.activity.list({ filterTypes: filters })
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
    setIsLoadingMore(true)
  }, [filters])

  const fetchMore = useCallback(async () => {
    const newTransactions = await list.take(pageSize)
    setTransactions([...transactions, ...newTransactions])
  }, [list, pageSize, transactions])

  return { transactions, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}
