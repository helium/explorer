import { useCallback } from 'react'
import Image from 'next/image'
import Timestamp from 'react-timestamp'
import BaseList from './BaseList'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { getTxnTypeName } from '../../utils/txns'
import animalHash from 'angry-purple-tiger'

const TransactionList = ({
  transactions,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  // const { selectTxn } = useSelectedTxn()

  const handleSelectTxn = useCallback((txn) => {
    console.log('selected txn', txn)
    // if (txn.type === 'poc_receipts_v1') selectTxn(txn.hash)
  }, [])

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => `/txns/${txn.hash}`, [])

  const renderTitle = useCallback((txn) => {
    switch (txn.type) {
      case 'poc_receipts_v1':
        return (
          <span className="flex items-center text-black font-sans font-medium">
            {animalHash(txn.path[0].challengee)}
          </span>
        )
      default:
        return <span className="text-black">{getTxnTypeName(txn.type)}</span>
    }
  }, [])

  const renderSubtitle = useCallback((txn) => {
    switch (txn.type) {
      case 'poc_receipts_v1':
        return (
          <span className="flex items-center">
            <img src="/images/poc_receipt_icon.svg" className="h-3 w-auto" />
            <span className="ml-1.5 whitespace-nowrap text-sm font-sans">
              {animalHash(txn.challenger)}
            </span>
            <span className="ml-3 flex flex-row items-center justify-start">
              <img
                src="/images/witness-yellow-mini.svg"
                className="h-3 w-auto"
              />
              <span className="ml-1.5 text-sm font-sans">
                {txn.path[0].witnesses.length}
              </span>
            </span>
          </span>
        )
      // TODO: add all other common txn types here as cases
      default:
        return (
          <span className="flex items-center space-x-1">
            <img src="/images/clock.svg" className="h-3 w-auto" />
            <Timestamp date={txn.time} className="tracking-tight" />
          </span>
        )
    }
  }, [])

  const renderDetails = useCallback((txn) => {
    return <span></span>
  }, [])

  return (
    <BaseList
      items={transactions}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectTxn}
      isLoading={isLoading}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No activity"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
    />
  )
}

export default TransactionList
