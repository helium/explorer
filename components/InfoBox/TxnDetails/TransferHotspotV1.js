import { useState } from 'react'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import HotspotWidget from '../../Widgets/HotspotWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { useAsync } from 'react-async-hook'
import animalHash from 'angry-purple-tiger'
import { fetchHotspot } from '../../../data/hotspots'
import Skeleton from '../../Common/Skeleton'

const TransferHotspotV1 = ({ txn, inline }) => {
  const [transferredHotspot, setTransferredHotspot] = useState()

  useAsync(async () => {
    const fetchedHotspot = await fetchHotspot(txn.gateway)
    setTransferredHotspot(fetchedHotspot)
  }, [txn.gateway])

  return (
    <InfoBoxPaneContainer padding={!inline}>
      {transferredHotspot ? (
        <HotspotWidget
          title="Transferred Hotspot"
          hotspot={transferredHotspot}
        />
      ) : (
        <Widget
          title="Transferred Hotspot"
          value={animalHash(txn.gateway)}
          span={2}
          change={<Skeleton className="w-1/3" />}
        />
      )}
      <AccountWidget title="Seller" address={txn.seller} />
      <AccountWidget title="Buyer" address={txn.buyer} />
      <Widget
        title="Payment to Seller"
        value={txn.amountToSeller.toString(2)}
      />
      <Widget title="Fee" value={txn.fee.toString()} />
    </InfoBoxPaneContainer>
  )
}

export default TransferHotspotV1
