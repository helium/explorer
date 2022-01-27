import classNames from 'classnames'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'
import { Link } from 'react-router-i18n'
import useSelectedTxn from '../../../hooks/useSelectedTxn'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'
import { useCallback, useEffect, useState } from 'react'
import ActivityIcon from './ActivityIcon'
import ActivityItemTimestamp from './ActivityItemTimestamp'
import Skeleton from '../../Common/Skeleton'
import { fetchTxnDetails } from '../../../data/txns'
import ChevronThin from '../../Icons/ChevronThin'
import TxnDetailsSwitch from '../../InfoBox/TxnDetails/TxnDetailsSwitch'
import ActivityItemPrefetchedSummary from './ActivityItemPrefetchedSummary'

import {
  ExpandedPoCReceiptContent,
  // ExpandedPaymentContent,
  ExpandedRewardContent,
  ExpandedStateChannelCloseContent,
} from './InlineExpandedContent'
import { shouldPrefetchDetails } from './PrefetchedSummaries/utils'

const ExpandedContent = ({ txn, role, address }) => {
  if (!txn) {
    // TODO: add better skeleton, maybe specific to each type of txn
    return (
      <div className="space-y-2">
        <Skeleton />
        <Skeleton />
      </div>
    )
  }

  // TODO: flesh out payment summary
  // if (txn.type.startsWith('payment')) {
  //   return <ExpandedPaymentContent txn={txn} role={role} address={address} />
  // }

  if (
    txn.type === 'rewards_v1' ||
    txn.type === 'rewards_v2' ||
    txn.type === 'rewards_v3'
  ) {
    return <ExpandedRewardContent txn={txn} role={role} />
  }

  if (txn.type === 'state_channel_close_v1') {
    return (
      <ExpandedStateChannelCloseContent
        txn={txn}
        role={role}
        address={address}
      />
    )
  }

  if (txn.type === 'poc_receipts_v1') {
    return <ExpandedPoCReceiptContent txn={txn} role={role} address={address} />
  }

  // TODO: add inline summaries of all other common txn types

  return <TxnDetailsSwitch txn={txn} isLoading={!txn} inline />
}

const ExpandableListItem = ({
  address,
  context,
  txn,
  title,
  linkTo,
  highlightColor,
}) => {
  const [expanded, toggleExpanded] = useToggle()

  const { selectTxn, clearSelectedTxn } = useSelectedTxn()
  const { selectHotspot, clearSelectedHotspot } = useSelectedHotspot()

  const [txnDetails, setTxnDetails] = useState()
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [isPrefetched, setIsPrefetched] = useState(false)

  const fetchTxn = async (txn, address) => {
    setDetailsLoading(true)
    const details = await fetchTxnDetails(
      txn.hash,
      // if txn is a reward or state channel close, pass actor param to
      // get summary with context instead of entire transaction
      txn?.type.startsWith('rewards') || txn?.type === 'state_channel_close_v1'
        ? { actor: address }
        : {},
    )
    setTxnDetails(details)
    setDetailsLoading(false)
  }

  useEffect(() => {
    if (shouldPrefetchDetails(txn.type)) {
      setIsPrefetched(true)
      fetchTxn(txn, address)
    }
    return () => {
      setIsPrefetched(false)
      setTxnDetails(null)
    }
  }, [address, txn])

  const handleItemClick = useCallback(() => {
    if (expanded) {
      clearSelectedTxn()
      if (context === 'hotspot') selectHotspot(address)
    } else {
      if (!txn.type.startsWith('rewards')) {
        selectTxn(txn.hash)
      }
      if (!isPrefetched) {
        fetchTxn(txn, address)
      }
    }
    toggleExpanded()
  }, [
    address,
    clearSelectedTxn,
    context,
    expanded,
    isPrefetched,
    selectHotspot,
    selectTxn,
    toggleExpanded,
    txn,
  ])

  useEffect(() => {
    return () => {
      clearSelectedTxn()
    }
  }, [clearSelectedTxn])

  return (
    <>
      <div
        className={classNames(
          'bg-white hover:bg-bluegray-50 focus:bg-bluegray-50 cursor-pointer transition-all duration-75 relative flex border-solid border-bluegray-300 border-t-0 h-[60px]',
        )}
        onClick={handleItemClick}
      >
        <div className="w-full flex items-stretch justify-center">
          <div className="w-full flex px-4 py-2 space-x-2 items-center">
            <ActivityIcon txn={txn} highlightColor={highlightColor} />
            <div className="w-full flex flex-row">
              <div className="w-full flex flex-col justify-between">
                <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans">
                  {title}
                </div>
                {isPrefetched && !expanded && (
                  <ActivityItemPrefetchedSummary
                    txn={txnDetails}
                    detailsLoading={detailsLoading}
                    address={address}
                    role={txn.role}
                  />
                )}
              </div>
              <ActivityItemTimestamp txn={txn} expanded={expanded} />
              <div className={'flex items-center justify-center'}>
                <ChevronThin
                  className={classNames(
                    'h-auto text-gray-550 transition-all duration-200 w-3.5 transform',
                    { 'rotate-0': expanded, 'rotate-180': !expanded },
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames(
          'w-full flex flex-col justify-between bg-bluegray-50 transition-all duration-200',
          { 'py-0 opacity-0': !expanded, 'py-4 opacity-100': expanded },
        )}
      >
        {expanded && (
          <div className="px-6">
            <div
              className={classNames('bg-white w-full rounded-t-lg px-2 py-2', {
                'rounded-b-lg': txnDetails?.type.startsWith('rewards'),
              })}
            >
              <ExpandedContent
                txn={txnDetails}
                role={txn.role}
                address={address}
              />
            </div>
            {txnDetails && !txnDetails?.type.startsWith('rewards') && (
              <Link
                to={linkTo}
                // clear selected hotspot when navigating to selected transaction, this was causing a Mapbox error on mobile
                onClick={clearSelectedHotspot}
                className={classNames(
                  'w-full bg-white hover:bg-gray-350 transition-all duration-200 cursor-pointer rounded-b-lg mt-px flex items-center justify-center',
                )}
              >
                <p className="text-gray-700 font-sans font-medium text-sm p-2 m-0">
                  View Transaction Details
                </p>
                <ChevronIcon
                  className={
                    'h-auto text-gray-700 transition-all duration-200 w-4 transform rotate-90'
                  }
                />
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="w-full border-solid border-b border-bluegray-300" />
    </>
  )
}
export default ExpandableListItem
