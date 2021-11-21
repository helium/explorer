import { useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from './client'
import { supplementTxnList } from './txns'

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
  const [error, setError] = useState(null)

  useAsync(async () => {
    if (!error) {
      try {
        const clientContext = pickClientContext(address, context)
        const newList = await clientContext.activity.list({
          filterTypes: filters,
        })
        setList(newList)
      } catch (e) {
        setError(e)
      }
    }
  }, [address, filters, context, error])

  useAsync(async () => {
    if (!error) {
      try {
        if (!list) return
        setIsLoadingMore(true)
        const newTransactions = await list.take(pageSize)
        setTransactions(supplementTxnList(newTransactions))
        setIsLoadingMore(false)
        setIsLoadingInitial(false)
        if (newTransactions.length < pageSize) {
          setHasMore(false)
        }
      } catch (e) {
        setError(e)
      }
    }
  }, [list, pageSize, error])

  useEffect(() => {
    setIsLoadingInitial(true)
    setIsLoadingMore(true)
  }, [filters])

  const fetchMore = useCallback(async () => {
    if (!error) {
      try {
        const newTransactions = await list.take(pageSize)
        setTransactions([
          ...transactions,
          ...supplementTxnList(newTransactions),
        ])
      } catch (e) {
        setError(e)
      }
    }
  }, [list, pageSize, transactions, error])

  return {
    transactions,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
    error,
    setError,
  }
}
