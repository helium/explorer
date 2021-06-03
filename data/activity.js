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
    const clientContext =
      context === 'hotspot' ? client.hotspot(address) : client.account(address)
    const newList = await clientContext.activity.list({ filterTypes: filters })
    setList(newList)
  }, [address, filters])

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

export const getActivityForChecklist = async (address) => {
  // Get most recent challenger transaction
  const challengerTxnList = await client.hotspot(address).activity.list({
    filterTypes: ['poc_request_v1'],
  })
  const challengerTxn = await challengerTxnList.take(1)

  // Get most recent challengee transaction
  const challengeeTxnList = await client.hotspot(address).activity.list({
    filterTypes: ['poc_receipts_v1'],
  })
  const challengeeTxn = await challengeeTxnList.take(1)

  // Get most recent rewards transactions to search for witness / data activity
  const rewardTxnsList = await client.hotspot(address).activity.list({
    filterTypes: ['rewards_v1'],
  })
  const rewardTxns = await rewardTxnsList.take(200)

  let witnessTxn = null
  // most recent witness transaction
  rewardTxns.some(function (txn) {
    return txn.rewards.some(function (txnReward) {
      if (txnReward.type === 'poc_witnesses') {
        witnessTxn = txn
        return
      }
    })
  })
  let dataTransferTxn = null
  // most recent data credit transaction
  rewardTxns.some(function (txn) {
    return txn.rewards.some(function (txnReward) {
      if (txnReward.type === 'data_credits') {
        dataTransferTxn = txn
        return
      }
    })
  })
  return {
    challengerTxn: challengerTxn.length === 1 ? challengerTxn[0] : null,
    challengeeTxn: challengeeTxn.length === 1 ? challengeeTxn[0] : null,
    witnessTxn: witnessTxn,
    dataTransferTxn: dataTransferTxn,
  }
}
