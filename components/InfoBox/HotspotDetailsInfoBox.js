import { useEffect, useMemo } from 'react'
import animalHash from 'angry-purple-tiger'
import { useAsync } from 'react-async-hooks'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import StatisticsPane from './HotspotDetails/StatisticsPane'
import ActivityPane from './HotspotDetails/ActivityPane'
import WitnessesPane from './HotspotDetails/WitnessesPane'
import NearbyHotspotsPane from './HotspotDetails/NearbyHotspotsPane'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import BeaconsPane from './Beacons/BeaconsPane'

const HotspotDetailsRoute = () => {
  const { address } = useParams()

  const { selectedHotspot: hotspot, selectHotspot } = useSelectedHotspot()

  useAsync(async () => {
    if (!hotspot) {
      selectHotspot(address)
    }
  }, [hotspot, address])

  if (!hotspot) return null

  return <HotspotDetailsInfoBox />
}

const HotspotDetailsInfoBox = () => {
  const {
    selectedHotspot: hotspot,
    clearSelectedHotspot,
  } = useSelectedHotspot()

  const title = useMemo(() => animalHash(hotspot.address), [hotspot])

  useEffect(() => {
    return () => {
      clearSelectedHotspot()
    }
  }, [clearSelectedHotspot])

  return (
    <InfoBox title={title}>
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane hotspot={hotspot} />
        </TabPane>

        <TabPane title="Activity" path="activity" key="activity">
          <ActivityPane hotspot={hotspot} />
        </TabPane>

        <TabPane title="Witnesses" path="witnesses" key="witnesses">
          <WitnessesPane hotspot={hotspot} />
        </TabPane>

        <TabPane title="Nearby" path="nearby" key="nearby">
          <NearbyHotspotsPane hotspot={hotspot} />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotDetailsRoute
