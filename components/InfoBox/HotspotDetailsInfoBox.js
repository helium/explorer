import { useEffect, useMemo } from 'react'
import animalHash from 'angry-purple-tiger'
import { useAsync } from 'react-async-hooks'
import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import RewardsTrendWidget from '../Widgets/RewardsTrendWidget'
import Widget from '../Widgets/Widget'
import { useHotspotRewards } from '../../data/rewards'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import Hex from '../Hex'
import { generateRewardScaleColor } from '../Hotspots/utils'
import StatusWidget from '../Widgets/StatusWidget'
import WitnessesPane from './HotspotDetails/WitnessesPane'
import NearbyHotspotsPane from './HotspotDetails/NearbyHotspotsPane'
import ActivityPane from './HotspotDetails/ActivityPane'

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

  const { rewards } = useHotspotRewards(hotspot.address)

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
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <RewardsTrendWidget title="30 Day Earnings" series={rewards} />
            <Widget
              title="Reward Scaling"
              value={hotspot.rewardScale?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              icon={
                <Hex
                  width={21}
                  height={24}
                  fillColor={generateRewardScaleColor(hotspot.rewardScale)}
                />
              }
              subtitle={<span className="text-gray-550">No Change</span>}
            />
            <StatusWidget hotspot={hotspot} />
            <Widget title="7D Beacons" value="54" change="+2" />
            <Widget title="7D Avg Witnesses" value="6.3" change="+0.5%" />
            <div className="col-span-2 pb-1" />
          </div>
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
