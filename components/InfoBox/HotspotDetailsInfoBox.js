import { useMemo } from 'react'
import animalHash from 'angry-purple-tiger'
import InfoBox from './InfoBox'
import TabNavbar from '../Nav/TabNavbar'
import RewardsTrendWidget from '../Widgets/RewardsTrendWidget'
import Widget from '../Widgets/Widget'
import { useHotspotRewards } from '../../data/rewards'

const HotspotDetailsInfoBox = ({ hotspot, visible, toggleVisible }) => {
  const { rewards } = useHotspotRewards(hotspot.address)

  const title = useMemo(() => animalHash(hotspot.address), [hotspot])

  return (
    <InfoBox title={title} visible={visible} toggleVisible={toggleVisible}>
      <div className="w-full bg-white z-10 rounded-t-xl">
        <TabNavbar />
      </div>
      <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
        <RewardsTrendWidget title="30 Day Earnings" series={rewards} />
        <Widget
          title="Reward Scaling"
          value="0.50"
          subtitle={<span className="text-gray-550">No Change</span>}
        />
        <Widget title="Sync Status" value="Synced" />
        <Widget title="7D Beacons" value="54" change="+2" />
        <Widget title="7D Avg Witnesses" value="6.3" change="+0.5%" />
        <div className="col-span-2 pb-1" />
      </div>
    </InfoBox>
  )
}

export default HotspotDetailsInfoBox
