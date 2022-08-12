import { useCallback } from 'react'
import Image from 'next/image'
import BaseList from './BaseList'
import BlockTimestamp from '../Common/BlockTimestamp'

const BlockTransactionsList = ({
  transactions,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const handleSelectTxn = useCallback((txn) => {
    console.log('selected txn', txn)
  }, [])

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const renderTitle = useCallback((txn) => {
    return <span>{txn.type}</span>
  }, [])

  const renderSubtitle = useCallback((txn) => {
    return (
      <span className="flex items-center space-x-1">
        <Image src="/images/clock.svg" width={14} height={14} />
        <BlockTimestamp blockTime={txn.time} className="tracking-tight" />
      </span>
    )
  }, [])

  const renderDetails = useCallback((txn) => {
    return <span>types</span>
  }, [])

  return (
    <BaseList
      items={transactions}
      keyExtractor={keyExtractor}
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

export default BlockTransactionsList
