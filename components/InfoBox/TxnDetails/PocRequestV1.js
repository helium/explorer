import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import HotspotWidget from '../../Widgets/HotspotWidget'
import { fetchHotspot } from '../../../data/hotspots'
import AccountWidget from '../../Widgets/AccountWidget'
import Widget from '../../Widgets/Widget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const PocRequestV1 = ({ txn }) => {
  const [challenger, setChallenger] = useState()

  useAsync(async () => {
    const fetchedChallenger = await fetchHotspot(txn.challenger)
    setChallenger(fetchedChallenger)
  }, [])

  return (
    <InfoBoxPaneContainer>
      <HotspotWidget title="Challenger Hotspot" hotspot={challenger} />
      <AccountWidget title="Challenger Owner" address={txn.challengerOwner} />
      <Widget title="Version" value={txn.version} />
      <Widget title="Fee" value={txn.fee.toString()} />
      <Widget
        title="Secret Hash"
        value={txn.secretHash}
        copyableValue={txn.secretHash}
        span={2}
      />
      <Widget
        title="Onion Key Hash"
        value={txn.onionKeyHash}
        copyableValue={txn.onionKeyHash}
        span={2}
      />
      <Widget
        title="Block Hash"
        value={txn.blockHash}
        span={2}
        copyableValue={txn.blockHash}
      />
    </InfoBoxPaneContainer>
  )
}

export default PocRequestV1
