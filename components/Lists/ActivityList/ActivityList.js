import { useCallback } from 'react'
import Timestamp from 'react-timestamp'
import { uniq } from 'lodash'
import BaseList from '../BaseList'
import FlagLocation from '../../Common/FlagLocation'
import WitnessPill from '../../Common/WitnessPill'
import Pill from '../../Common/Pill'
import {
  getPocReceiptRole,
  getTxnTypeColor,
  getTxnTypeName,
} from '../../../utils/txns'
import ExpandableListItem from './ExpandableActivityListItem'
import ActivityListItem from './ActivityListItem'
import animalHash from 'angry-purple-tiger'

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
      case 'rewards_v1':
      case 'rewards_v2':
        return `+${txn.totalAmount.toString(3)}`

      case 'poc_receipts_v1':
        return (
          // <span>
          //   {getTxnTypeName(getPocReceiptRole(txn, address), 'hotspot')}
          // </span
          <div className="flex items-center justify-start">
            <img
              src="/images/poc_receipt_icon.svg"
              className="h-3 w-auto mr-2"
            />
            <FlagLocation geocode={txn.path[0].geocode} condensedView />
          </div>
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
            {/* <span>{`+${txn.totalAmount.toString(3)}`}</span> */}
            <span className="flex items-center justify-start">
              <img src="/images/hnt.svg" className="w-4 mr-1" />
              {txn?.rewards?.length}{' '}
              {txn?.rewards?.length === 1 ? 'reward' : 'rewards'}
            </span>
          </>
        )

      case 'poc_receipts_v1':
        return (
          <>
            {timestamp}
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
      // case 'rewards_v1':
      // case 'rewards_v2':
      //   return getTxnTypeName(getPocReceiptRole(txn.type), 'hotspot')

      case 'poc_receipts_v1':
        return getTxnTypeName(getPocReceiptRole(txn, address), 'hotspot')

      default:
        return getTxnTypeName(txn.type, 'hotspot')
    }
  }

  const renderItem = useCallback((txn) => {
    if (isExpandable(txn)) {
      const expandableContent =
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
        ) : (
          <div className="bg-gray-300 w-full rounded-md px-2 py-1">
            <div>
              <span className="flex items-center font-sans font-thin text-darkgray-800">
                Challenger
              </span>
              <span className="flex items-center text-black font-sans font-medium">
                {animalHash(txn.challenger)}
              </span>
            </div>
            <div className="flex-col items-center justify-start mt-4">
              <span className="font-sans font-thin text-darkgray-800">
                Beaconer
              </span>
              <span className="flex items-center">
                <img
                  src="/images/poc_receipt_icon.svg"
                  className="h-3 w-auto"
                />
                <span className="ml-1.5 whitespace-nowrap text-sm font-sans text-black">
                  {animalHash(txn.path[0].challengee)}
                </span>
              </span>
            </div>
            <div className="flex flex-row items-center justify-start mt-4">
              <span className="font-sans font-thin text-darkgray-800">
                Witnesses
              </span>
              <span className="ml-1.5 text-sm font-sans">
                {txn.path[0].witnesses.length}
              </span>
            </div>
          </div>
        )
      return (
        <ExpandableListItem
          txn={txn}
          address={address}
          context={context}
          title={generateTitle(txn)} // getTxnTypeName(txn.type, 'hotspot')}
          subtitle={generateSubtitle(txn)}
          details={generateDetails(txn)} //getTxnTypeName(txn.type, 'hotspot')}
          linkTo={`/txns/${txn.hash}`}
          pillColor={getTxnTypeColor(txn.type)}
          pillClasses={'text-white text-sm'}
          pillSymbolClasses={'text-white text-sm'}
          expandedContent={expandableContent}
        />
      )
    }

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
