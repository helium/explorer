import { useState } from 'react'
import { useAsync } from 'react-async-hook'
import { fetchHotspot } from '../../../data/hotspots'
import HotspotWidget from '../../Widgets/HotspotWidget'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ValidatorWidget from '../../Widgets/ValidatorWidget'
import WitnessesWidget from '../../Widgets/WitnessesWidget'

const PoCReceiptsV2 = ({ txn }) => {
  const [beaconer, setBeaconer] = useState()

  useAsync(async () => {
    const fetchedBeaconer = await fetchHotspot(txn.path[0].challengee)
    setBeaconer(fetchedBeaconer)
  }, [])

  return (
    <InfoBoxPaneContainer>
      <ValidatorWidget
        title="Challenger"
        titleIconPath="/images/challenger-icon.svg"
        address={txn.challenger}
      />
      <HotspotWidget
        title="Beaconer"
        titleIconPath="/images/poc_receipt_icon.svg"
        hotspot={beaconer}
      />
      <WitnessesWidget path={txn.path[0]} />
    </InfoBoxPaneContainer>
  )
}

export default PoCReceiptsV2
