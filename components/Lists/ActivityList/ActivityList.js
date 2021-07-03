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

const isExpandable = (txn) => {
  return (
    txn.type === 'rewards_v1' ||
    txn.type === 'rewards_v2' ||
    txn.type === 'poc_receipts_v1'
  )
}

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
            <span>
              {getTxnTypeName(getPocReceiptRole(txn, address), 'hotspot')}
            </span>
          )
        case 'payment_v1':
        case 'payment_v2':
          return (
            <span>{txn.payer === address ? 'Sent HNT' : 'Received HNT'}</span>
          )

        default:
          return <span>{getTxnTypeName(txn.type, context)}</span>
      }
    },
    [address, context],
  )

  const generateSubtitle = useCallback(
    (txn) => {
      const timestamp = (
        <span className="flex items-center space-x-1">
          <img alt="" src="/images/clock.svg" className="w-3.5 h-3.5" />
          <span>
            <TimeAgo date={txn.time * 1000} timeStyle="mini" />
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
          const summary = txn?.stateChannel?.summaries
          return (
            <>
              {timestamp}
              <span className="flex items-center justify-start">
                <img alt="" src="/images/dc.svg" className="h-3 w-auto mr-1" />
                <span className="mr-1">
                  {txn.stateChannel.summaries[0].num_dcs} DC
                </span>
                <span>
                  {`(${summary[0]?.num_packets} packet${
                    summary[0]?.num_packets === 1 ? '' : 's'
                  })`}
                </span>
              </span>
            </>
          )
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

  const generateDetails = useCallback((txn) => {
    switch (txn.type) {
      case 'poc_receipts_v1':
        return getTxnTypeName(txn.type)

      default:
        return getTxnTypeName(txn.type)
    }
  }, [])

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
            details={generateDetails(txn)}
            linkTo={`/txns/${txn.hash}`}
            pillColor={getTxnTypeColor(txn.type)}
            pillClasses={'text-white text-xs md:text-sm'}
            pillSymbolClasses={'text-white text-xs md:text-sm'}
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
          details={getTxnTypeName(txn.type, 'block')}
          linkTo={`/txns/${txn.hash}`}
          pillColor={getTxnTypeColor(txn.type)}
          pillClasses={'text-white text-xs md:text-sm'}
          pillSymbolClasses={'text-white text-xs md:text-sm'}
        />
      )
    },
    [address, context, generateDetails, generateSubtitle, generateTitle],
  )

  const expandableItem = useCallback((txn) => {
    if (isExpandable(txn)) return true
  }, [])

  return (
    <BaseList
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
