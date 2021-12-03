import animalHash from 'angry-purple-tiger'
import { useEffect, useState } from 'react'
import { fetchHotspot } from '../../../../data/hotspots'
import useSelectedTxn from '../../../../hooks/useSelectedTxn'
import AccountWidget from '../../../Widgets/AccountWidget'
import HotspotWidget from '../../../Widgets/HotspotWidget'
import Widget from '../../../Widgets/Widget'
import SkeletonContent from './SkeletonContent'

const ExpandedHotspotTransferContent = ({ txn }) => {
  const { selectedTxn, selectTxn, clearSelectedTxn } = useSelectedTxn()
  const [transferredHotspot, setTransferredHotspot] = useState(null)
  useEffect(() => {
    const fetchTransferredHotspot = async () => {
      const fetchedHotspot = await fetchHotspot(txn.gateway)
      setTransferredHotspot(fetchedHotspot)
    }
    if (!selectedTxn) {
      selectTxn(txn.hash)
      fetchTransferredHotspot()
    }
  }, [selectTxn, selectedTxn, txn.gateway, txn.hash])

  useEffect(() => {
    return () => {
      clearSelectedTxn()
    }
  }, [clearSelectedTxn])

  if (!selectedTxn) {
    return <SkeletonContent />
  }

  return (
    <div className="grid grid-cols-1 w-full space-y-1 my-0.5">
      {transferredHotspot ? (
        <HotspotWidget
          title="Transferred Hotspot"
          hotspot={transferredHotspot}
        />
      ) : (
        <Widget
          title="Transferred Hotspot"
          value={animalHash(selectedTxn.gateway)}
          span={2}
          linkTo={`/hotspots/${selectedTxn.gateway}`}
        />
      )}
      <AccountWidget title="Seller" address={txn.seller} />
      <AccountWidget title="Buyer" address={txn.buyer} />
      <Widget
        span={2}
        title="Payment to Seller"
        value={txn.amountToSeller.toString(2)}
        subtitle={`Fee: ${txn.fee.toString()}`}
      />
    </div>
  )
}

export default ExpandedHotspotTransferContent
