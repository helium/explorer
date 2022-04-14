import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import { fetchHotspot } from '../../../data/hotspots'
import HotspotWidget from '../../Widgets/HotspotWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import WitnessesWidget from '../../Widgets/WitnessesWidget'

const PoCReceiptsV1 = ({ txn }) => {
  const [challenger, setChallenger] = useState()
  const [target, setTarget] = useState()

  useAsync(async () => {
    const [fetchedChallenger, fetchedTarget] = await Promise.all([
      fetchHotspot(txn.challenger),
      fetchHotspot(txn.path[0].challengee),
    ])
    setChallenger(fetchedChallenger)
    setTarget(fetchedTarget)
  }, [])

  return (
    <InfoBoxPaneContainer>
      <HotspotWidget
        title="Challenger"
        titleIconPath="/images/challenger-icon.svg"
        hotspot={challenger}
      />
      <HotspotWidget
        title="Beaconer"
        titleIconPath="/images/poc_receipt_icon.svg"
        hotspot={target}
      />
      <WitnessesWidget path={txn.path[0]} />
    </InfoBoxPaneContainer>
  )
}

export default PoCReceiptsV1
