import { useCallback } from 'react'
import animalHash from 'angry-purple-tiger'
import TimeAgo from 'react-time-ago'
import { round, sumBy } from 'lodash'
import StatusCircle from '../Hotspots/StatusCircle'
import Hex from '../Hex'
import { generateRewardScaleColor } from '../Hotspots/utils'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import BaseList from './BaseList'
import { useHotspotRewards } from '../../data/rewards'
import RewardScaleHex from '../Common/RewardScaleHex'
import Skeleton from '../Common/Skeleton'

const HexHotspotsList = ({
  hotspots,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const { selectHotspot } = useSelectedHotspot()

  const handleSelectHotspot = useCallback(
    (hotspot) => {
      selectHotspot(hotspot.address)
    },
    [selectHotspot],
  )

  const keyExtractor = useCallback((h) => h.address, [])

  const linkExtractor = useCallback((h) => `/hotspots/${h.address}`, [])

  const renderItem = useCallback((h) => <HotspotItem hotspot={h} />, [])

  return (
    <BaseList
      items={hotspots}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectHotspot}
      isLoading={isLoading}
      renderItem={renderItem}
      blankTitle="No Hotspots"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
    />
  )
}

const HotspotRewards = ({ address }) => {
  const { rewards } = useHotspotRewards(address, 30, 'day')

  if (!rewards) {
    return <Skeleton className="w-32" />
  }

  return (
    <span className="flex items-center">
      <img src="/images/hnt.svg" className="w-4 mr-1" />+
      {rewards && round(sumBy(rewards, 'total'), 2)} HNT (30d)
    </span>
  )
}

const HotspotItem = ({ hotspot }) => {
  return (
    <>
      <div className="w-full">
        <div className="text-base font-medium">
          <StatusCircle status={hotspot.status} />
          {animalHash(hotspot.address)}
        </div>
        <div className="flex items-center space-x-4 h-6 text-gray-800">
          <RewardScaleHex rewardScale={hotspot?.rewardScale} />
          <HotspotRewards address={hotspot.address} />
        </div>
      </div>
      <div className="flex items-center px-4">
        <span className="whitespace-nowrap text-gray-700">
          <TimeAgo date={hotspot.timestampAdded} />
        </span>
      </div>
      <div className="flex items-center">
        <img src="/images/details-arrow.svg" />
      </div>
    </>
  )
}

export default HexHotspotsList
