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
import ExpandedPoCReceiptContent from './ExpandedPoCReceiptContent'
import ExpandedRewardContent from './ExpandedRewardContent'
import PaymentSubtitle from './PaymentSubtitle'
import animalHash from 'angry-purple-tiger'
import Timestamp from 'react-timestamp'

const isExpandable = (txn) => {
  return (
    txn.type === 'rewards_v1' ||
    txn.type === 'rewards_v2' ||
    txn.type === 'rewards_v3' ||
    txn.type === 'poc_receipts_v1'
  )
}

const ActivityList = ({
  title,
  description,
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

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => {
    if (isExpandable(txn)) return false
    return `/txns/${txn.hash}`
  }, [])

  const generateTitle = useCallback(
    (txn) => {
      switch (txn.type) {
        case 'poc_receipts_v1':
          return (
            <span className="flex items-end justify-start">
              <span>
                {getTxnTypeName(getPocReceiptRole(txn, address), 'hotspot')}
              </span>
              <span className="hidden md:block text-xs text-gray-600 font-sans font-extralight ml-1 mb-0.5">
                <TimeAgo date={txn.time * 1000} timeStyle="mini" /> ago
              </span>
            </span>
          )
        case 'payment_v1':
        case 'payment_v2':
          return (
            <span>{txn.payer === address ? 'Sent HNT' : 'Received HNT'}</span>
          )

        default:
          return (
            <span className="flex items-end justify-start">
              <span>{getTxnTypeName(txn.type, context)}</span>
              <span className="hidden md:block text-xs text-gray-600 font-sans font-extralight ml-1 mb-0.5">
                <TimeAgo date={txn.time * 1000} timeStyle="mini" /> ago
              </span>
            </span>
          )
      }
    },
    [address, context],
  )

  const generateSubtitle = useCallback(
    (txn) => {
      const timestamp = (
        <>
          <span className="flex items-center">
            <span className="hidden md:flex items-center space-x-1">
              <img alt="" src="/images/clock.svg" className="w-3.5 h-3.5" />
              <span className="tracking-tighter">
                <Timestamp date={txn.time} />
              </span>
            </span>
            <span className="flex md:hidden items-center space-x-1">
              <img alt="" src="/images/clock.svg" className="w-3.5 h-3.5" />
              <span>
                <TimeAgo date={txn.time * 1000} timeStyle="mini" />
              </span>
            </span>
          </span>
        </>
      )
      switch (txn.type) {
        case 'rewards_v1':
        case 'rewards_v2':
          return (
            <>
              {timestamp}
              <span className="flex items-center justify-start">
                <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
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
                  alt=""
                  src="/images/poc_receipt_icon.svg"
                  className="h-3 w-auto mr-1"
                />
                <FlagLocation geocode={txn.path[0].geocode} condensedView />
              </div>
              <div className="flex items-center justify-start">
                <img
                  alt=""
                  src="/images/witness-yellow-mini.svg"
                  className="h-3 w-auto mr-1"
                />
                <span className="">
                  {txn.path?.[0]?.witnesses?.length || 0}
                </span>
              </div>
            </>
          )

        case 'payment_v1':
          // case 'payment_v2':
          return (
            <>
              {timestamp}
              <div className="flex items-center justify-start">
                {txn.payer === address ? (
                  <PaymentSubtitle
                    addressIsPayer
                    amount={txn.amount.toString(2)}
                    otherPartyAddress={txn.payee}
                  />
                ) : (
                  // this account was the recipient
                  <PaymentSubtitle
                    amount={txn.amount.toString(2)}
                    otherPartyAddress={txn.payer}
                  />
                )}
              </div>
            </>
          )

        case 'payment_v2':
          return (
            <>
              {timestamp}
              <div className="flex items-center justify-start">
                {txn.payer === address ? (
                  // this account was the payer
                  <PaymentSubtitle
                    addressIsPayer
                    amount={txn.totalAmount.toString(2)}
                    {...(txn.payments.length === 1
                      ? { otherPartyAddress: txn.payments[0].payee }
                      : { otherPartyString: `${txn.payments.length} payees` })}
                  />
                ) : (
                  // this account was a recipient
                  <PaymentSubtitle
                    amount={txn.payments
                      .find((p) => p.payee === address)
                      .amount.toString(2)}
                    otherPartyAddress={txn.payer}
                  />
                )}
              </div>
            </>
          )

        case 'state_channel_close_v1':
          return timestamp

        case 'stake_validator_v1':
          return (
            <>
              {timestamp}
              <span className="flex items-center justify-start">
                <div className="h-2 w-2 rounded-full bg-txn-stake mr-1" />
                <span className="mr-1">{animalHash(txn.address)}</span>
              </span>
            </>
          )
        default:
          return timestamp
      }
    },
    [address],
  )

  const renderItem = useCallback(
    (txn) => {
      if (isExpandable(txn)) {
        return (
          <ExpandableListItem
            txn={txn}
            address={address}
            context={context}
            title={generateTitle(txn)}
            subtitle={generateSubtitle(txn)}
            linkTo={`/txns/${txn.hash}`}
            highlightColor={
              txn.type === 'poc_receipts_v1'
                ? getTxnTypeColor(getPocReceiptRole(txn, address))
                : getTxnTypeColor(txn.type)
            }
            expandedContent={
              txn.type === 'rewards_v1' || txn.type === 'rewards_v2' ? (
                <ExpandedRewardContent txn={txn} address={address} />
              ) : (
                <ExpandedPoCReceiptContent txn={txn} address={address} />
              )
            }
          />
        )
      }

      return (
        <ActivityListItem
          title={generateTitle(txn)}
          subtitle={generateSubtitle(txn)}
          linkTo={`/txns/${txn.hash}`}
          highlightColor={getTxnTypeColor(txn.type)}
        />
      )
    },
    [address, context, generateSubtitle, generateTitle],
  )

  const expandableItem = useCallback((txn) => {
    if (isExpandable(txn)) return true
  }, [])

  return (
    <BaseList
      listHeaderTitle={title}
      listHeaderDescription={description}
      items={transactions}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      expandableItem={expandableItem}
      onSelectItem={handleSelectTxn}
      isLoading={isLoading}
      renderItem={renderItem}
      blankTitle="No activity"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      itemPadding={false}
    />
  )
}

export default ActivityList
