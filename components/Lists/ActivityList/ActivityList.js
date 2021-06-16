import { useCallback } from 'react'
import BaseList from '../BaseList'
import FlagLocation from '../../Common/FlagLocation'
import {
  getPocReceiptRole,
  getTxnTypeColor,
  getTxnTypeName,
} from '../../../utils/txns'
import ExpandableListItem from './ExpandableActivityListItem'
import ActivityListItem from './ActivityListItem'
import TimeAgo from 'react-time-ago'
import ExpandableActivityContent from './ExpandableActivityContent'

const ActivityList = ({
  address,
  context,
  transactions,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const handleSelectTxn = useCallback((txn) => {
    console.log('selected txn', txn)
  }, [])

  const isExpandable = (txn) => {
    return (
      txn.type === 'rewards_v1' ||
      txn.type === 'rewards_v2' ||
      txn.type === 'poc_receipts_v1'
    )
  }

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => {
    if (isExpandable(txn)) return
    return `/txns/${txn.hash}`
  }, [])

  const generateTitle = (txn) => {
    switch (txn.type) {
      case 'poc_receipts_v1':
        return (
          <span>
            {getTxnTypeName(getPocReceiptRole(txn, address), 'hotspot')}
          </span>
        )

      default:
        return <span>{getTxnTypeName(txn.type, 'hotspot')}</span>
    }
  }

  const generateSubtitle = (txn) => {
    const timestamp = (
      <span className="flex items-center space-x-1">
        <img src="/images/clock.svg" className="w-3.5 h-3.5" />
        <span>
          <TimeAgo date={txn.time * 1000} timeStyle="mini" /> ago
        </span>
      </span>
    )
    switch (txn.type) {
      case 'rewards_v1':
      case 'rewards_v2':
        return (
          <>
            {timestamp}
            <span className="flex items-center justify-start">
              <img src="/images/hnt.svg" className="w-4 mr-1" />
              <span>{`+${txn.totalAmount.toString(3)}`}</span>
            </span>
          </>
        )

      case 'poc_receipts_v1':
        return (
          <>
            {timestamp}
            <div className="flex items-center justify-start">
              <img
                src="/images/poc_receipt_icon.svg"
                className="h-3 w-auto mr-1"
              />
              <FlagLocation geocode={txn.path[0].geocode} condensedView />
            </div>
            <div className="flex items-center justify-start">
              <img
                src="/images/witness-yellow-mini.svg"
                className="h-3 w-auto mr-1"
              />
              <span className="">{txn.path?.[0]?.witnesses?.length || 0}</span>
            </div>
          </>
        )

      default:
        return timestamp
    }
  }

  const generateDetails = (txn) => {
    switch (txn.type) {
      case 'poc_receipts_v1':
        return getTxnTypeName(txn.type)

      default:
        return getTxnTypeName(txn.type)
    }
  }

  const renderItem = useCallback((txn) => {
    if (isExpandable(txn)) {
      return (
        <ExpandableListItem
          txn={txn}
          address={address}
          context={context}
          title={generateTitle(txn)}
          subtitle={generateSubtitle(txn)}
          details={generateDetails(txn)}
          linkTo={`/txns/${txn.hash}`}
          pillColor={getTxnTypeColor(txn.type)}
          pillClasses={'text-white text-xs md:text-sm'}
          pillSymbolClasses={'text-white text-xs md:text-sm'}
          expandedContent={
            <ExpandableActivityContent txn={txn} address={address} />
          }
        />
      )
    }

    return (
      <ActivityListItem
        title={generateTitle(txn)}
        subtitle={generateSubtitle(txn)}
        details={getTxnTypeName(txn.type, 'block')}
        linkTo={`/txns/${txn.hash}`}
        pillColor={getTxnTypeColor(txn.type)}
        pillClasses={'text-white text-xs md:text-sm'}
        pillSymbolClasses={'text-white text-xs md:text-sm'}
      />
    )
  }, [])

  return (
    <BaseList
      items={transactions}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectTxn}
      isLoading={isLoading}
      renderItem={renderItem}
      blankTitle="No activity"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      noPadding
    />
  )
}

export default ActivityList
