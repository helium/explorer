import { useCallback } from 'react'
import Timestamp from 'react-timestamp'
import { uniq } from 'lodash'
import BaseList from '../BaseList'
import FlagLocation from '../../Common/FlagLocation'
import WitnessPill from '../../Common/WitnessPill'
import Pill from '../../Common/Pill'
import { getTxnTypeColor, getTxnTypeName } from '../../../utils/txns'
import ExpandableListItem from './ExpandableActivityListItem'
import ActivityListItem from './ActivityListItem'

const ActivityList = ({
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
      case 'rewards_v1':
      case 'rewards_v2':
        return `+${txn.totalAmount.toString(3)}`

      case 'poc_receipts_v1':
        return (
          <span>{getTxnTypeName(txn.type)}</span>
          // <FlagLocation geocode={txn.path[0].geocode} shortenedLocationName />
        )

      default:
        return <span>{getTxnTypeName(txn.type, 'hotspot')}</span>
    }
  }

  const generateSubtitle = (txn) => {
    const timestamp = (
      <span className="flex items-center space-x-1">
        <img src="/images/clock.svg" className="w-3.5 h-3.5" />
        <Timestamp date={txn.time} className="tracking-tight" />
      </span>
    )
    switch (txn.type) {
      case 'rewards_v1':
      case 'rewards_v2':
        return (
          <>
            {timestamp}
            <span>{`+${txn.totalAmount.toString(3)}`}</span>
          </>
        )

      case 'poc_receipts_v1':
        return (
          <>
            {timestamp}
            <FlagLocation geocode={txn.path[0].geocode} shortenedLocationName />
          </>
        )

      default:
        return timestamp
    }
  }

  const renderDetails = useCallback((txn) => {
    switch (txn.type) {
      case 'rewards_v1':
      case 'rewards_v2':
        return (
          <span className="flex space-x-2">
            {uniq(txn.rewards.map((r) => r.type)).map((type) => (
              <Pill
                key={type}
                title={rewardTypeText[type] || type}
                tooltip={type}
                color={rewardTypeColor[type]}
              />
            ))}
          </span>
        )

      case 'poc_receipts_v1':
        return <WitnessPill count={txn.path?.[0]?.witnesses?.length || 0} />

      default:
        return null
    }
  }, [])

  const renderItem = useCallback((txn) => {
    if (isExpandable(txn))
      return (
        <ExpandableListItem
          txn={txn}
          title={generateTitle(txn)} // getTxnTypeName(txn.type, 'hotspot')}
          subtitle={generateSubtitle(txn)}
          details={getTxnTypeName(txn.type, 'block')}
          linkTo={`/txns/${txn.hash}`}
          pillColor={getTxnTypeColor(txn.type)}
          pillClasses={'text-white text-sm'}
          pillSymbolClasses={'text-white text-sm'}
          expandedContent={
            txn.type === 'rewards_v1' || txn.type === 'rewards_v2' ? (
              <div className="flex flex-row items-start w-full my-0.5">
                {uniq(txn.rewards.map((r) => r.type)).map((type) => (
                  <span className="mr-1">
                    <Pill
                      key={type}
                      title={rewardTypeText[type] || type}
                      tooltip={type}
                      color={rewardTypeColor[type]}
                    />
                  </span>
                ))}
              </div>
            ) : null
          }
        />
      )

    return (
      <ActivityListItem
        title={generateTitle(txn)} //getTxnTypeName(txn.type, 'hotspot')}
        subtitle={generateSubtitle(txn)}
        details={getTxnTypeName(txn.type, 'block')}
        linkTo={`/txns/${txn.hash}`}
        pillColor={getTxnTypeColor(txn.type)}
        pillClasses={'text-white text-sm'}
        pillSymbolClasses={'bg-orange-600 text-white text-sm'}
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

const rewardTypeText = {
  poc_witnesses: 'Witness',
  poc_challengers: 'Challenger',
  poc_challengees: 'Beacon',
  data_credits: 'Data',
  consensus: 'Consensus',
}

const rewardTypeColor = {
  poc_witnesses: 'yellow',
  // poc_challengers: 'Challenger',
  // poc_challengees: 'Beacon',
  // data_credits: 'Data',
  // consensus: 'Consensus',
}

export default ActivityList
