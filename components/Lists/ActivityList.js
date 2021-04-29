import { useCallback } from 'react'
import Timestamp from 'react-timestamp'
import { uniq } from 'lodash'
import BaseList from './BaseList'
import FlagLocation from '../Common/FlagLocation'
import WitnessPill from '../Common/WitnessPill'
import Pill from '../Common/Pill'

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

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => {
    return `/txns/${txn.hash}`
  }, [])

  const renderTitle = useCallback((txn) => {
    switch (txn.type) {
      case 'rewards_v1':
      case 'rewards_v2':
        return txn.totalAmount.toString(3)

      case 'poc_receipts_v1':
        return <FlagLocation geocode={txn.path[0].geocode} />

      default:
        return <span>{txn.type}</span>
    }
  }, [])

  const renderSubtitle = useCallback((txn) => {
    return (
      <span className="flex items-center space-x-1">
        <img src="/images/clock.svg" className="w-3.5 h-3.5" />
        <Timestamp date={txn.time} className="tracking-tighter" />
      </span>
    )
  }, [])

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
