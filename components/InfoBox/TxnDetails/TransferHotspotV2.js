import { useState } from 'react'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import HotspotWidget from '../../Widgets/HotspotWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { useAsync } from 'react-async-hook'
import animalHash from 'angry-purple-tiger'
import { fetchHotspot } from '../../../data/hotspots'

const TransferHotspotV2 = ({ txn, inline }) => {
  const [transferredHotspot, setTransferredHotspot] = useState()

  useAsync(async () => {
    const fetchedHotspot = await fetchHotspot(txn.gateway)
    setTransferredHotspot(fetchedHotspot)
  }, [])

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
        />
      )}
      <AccountWidget title="Previous Owner" address={txn.owner} />
      <AccountWidget title="New Owner" address={txn.newOwner} />
      <Widget title="Fee" value={txn.fee.toString()} />
    </InfoBoxPaneContainer>
  )
}

export default TransferHotspotV2
