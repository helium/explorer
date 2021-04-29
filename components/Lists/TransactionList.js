import { useCallback } from 'react'
import Image from 'next/image'
import Timestamp from 'react-timestamp'
import BaseList from './BaseList'
import useSelectedTxn from '../../hooks/useSelectedTxn'

const TransactionList = ({
  transactions,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const { selectTxn } = useSelectedTxn()

  const handleSelectTxn = useCallback((txn) => {
    console.log('selected txn', txn)
    // if (txn.type === 'poc_receipts_v1') selectTxn(txn.hash)
  }, [])

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => `/txns/${txn.hash}`, [])

  const renderTitle = useCallback((txn) => {
    return <span>{txn.type}</span>
  }, [])

  const renderSubtitle = useCallback((txn) => {
    return (
      <span className="flex items-center space-x-1">
        <Image src="/images/clock.svg" width={14} height={14} />
        <Timestamp date={txn.time} className="tracking-tight" />
      </span>
    )
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
      noPadding
    />
  )
}

export default TransactionList
