import ExpandedHotspotTransferContent from './HotspotTransfer'
import ExpandedPoCReceiptContent from './PoCReceipt'
import ExpandedRewardContent from './Reward'

const ExpandedContent = ({ address, txn }) => {
  if (
    txn.type === 'rewards_v1' ||
    txn.type === 'rewards_v2' ||
    txn.type === 'rewards_v3'
  ) {
    return <ExpandedRewardContent txn={txn} address={address} />
  }

  if (txn.type === 'poc_receipts_v1') {
    return <ExpandedPoCReceiptContent txn={txn} address={address} />
  }

  if (txn.type === 'transfer_hotspot_v1') {
    return <ExpandedHotspotTransferContent txn={txn} address={address} />
  }
}

export default ExpandedContent
