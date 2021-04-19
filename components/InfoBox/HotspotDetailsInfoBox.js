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
import classNames from 'classnames'

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
        <TabPane title="Statistics" key="1">
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
      </TabNavbar>
    </InfoBox>
  )
}

const StatusWidget = ({ hotspot }) => {
  const status = hotspot?.status?.online

  const value = useMemo(() => {
    if (status === 'offline') {
      return 'Offline'
    }
    if (
      hotspot.block - hotspot.status?.height >= 500 ||
      hotspot.status.height === null
    ) {
      return 'Syncing'
    }
    return 'Synced'
  }, [hotspot.block, hotspot.status.height, status])

  return (
    <Widget
      title="Sync Status"
      value={value}
      icon={
        <div
          className={classNames('rounded-full w-6 h-6', {
            'bg-green-400': status === 'online',
            'bg-red-400': status === 'offline',
          })}
        />
      }
      subtitle={
        <span className="text-gray-550">
          At block {hotspot?.status?.height?.toLocaleString()}
        </span>
      }
    />
  )
}

export default HotspotDetailsRoute
