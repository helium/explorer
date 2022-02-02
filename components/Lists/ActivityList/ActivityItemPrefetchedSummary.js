import Skeleton from '../../Common/Skeleton'
import { memo } from 'react'
import {
  PaymentV1Summary,
  PaymentV2Summary,
  PoCReceiptSummary,
  StateChannelCloseSummary,
  RewardSummary,
  HeartbeatSummary,
} from './PrefetchedSummaries'

const getSummaryComponent = (txn) => {
  switch (txn.type) {
    case 'payment_v1': {
      return PaymentV1Summary
    }
    case 'payment_v2': {
      return PaymentV2Summary
    }
    case 'poc_receipts_v1':
    case 'poc_receipts_v2': {
      return PoCReceiptSummary
    }
    case 'rewards_v1':
    case 'rewards_v2':
    case 'rewards_v3': {
      return RewardSummary
    }
    case 'state_channel_close_v1': {
      return StateChannelCloseSummary
    }
    case 'validator_heartbeat_v1': {
      return HeartbeatSummary
    }

    // we can also return other types that won't be prefetched, but will show up as a
    // subtitle /after/ the item has been expanded and then re-collapsed

    default:
      return null
  }
}

const ActivityItemPrefetchedSummary = ({
  txn,
  address,
  role,
  detailsLoading,
}) => {
  if (detailsLoading) {
    return <Skeleton className="w-1/2 opacity-80" />
  }

  const SummaryComponent = getSummaryComponent(txn)
  return (
    <div className="opacity-80">
      <SummaryComponent txn={txn} address={address} role={role} />
    </div>
  )
}

export default memo(ActivityItemPrefetchedSummary)
