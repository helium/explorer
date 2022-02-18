import { useCallback, useEffect, useState } from 'react'
import animalHash from 'angry-purple-tiger'
import { round, sumBy } from 'lodash'
import StatusCircle from '../Hotspots/StatusCircle'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import BaseList from './BaseList'
import { useRewardBuckets } from '../../data/rewards'
import RewardScaleHex from '../Common/RewardScaleHex'
import Skeleton from '../Common/Skeleton'
import HotspotTimeAgo from '../Common/HotspotTimeAgo'
import { isDataOnly } from '../Hotspots/utils'
import classNames from 'classnames'
import { getHotspotDenylistResults } from '../../data/hotspots'
import DenylistIcon from '../Icons/DenylistIcon'

const HexHotspotsList = ({
  hotspots,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
  title,
  description,
  showCount,
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
      listHeaderTitle={title}
      listHeaderShowCount={showCount}
      listHeaderDescription={description}
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
  const { rewards } = useRewardBuckets(address, 'hotspot', 30, 'day')

  if (!rewards) {
    return <Skeleton className="w-32" />
  }

  return (
    <span className="flex items-center">
      <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />+
      {rewards && round(sumBy(rewards, 'total'), 2)} HNT (30d)
    </span>
  )
}

const HotspotItem = ({ hotspot }) => {
  const [isOnDenylist, setIsOnDenylist] = useState(false)

  useEffect(() => {
    const checkDenylist = async () => {
      const denylistResults = await getHotspotDenylistResults(hotspot.address)
      if (denylistResults?.length > 0) setIsOnDenylist(true)
    }
    if (hotspot) checkDenylist()
  }, [hotspot])

  return (
    <>
      <div className={classNames('w-full', { 'opacity-50': isOnDenylist })}>
        <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans flex items-center justify-start">
          {!isDataOnly(hotspot) && <StatusCircle status={hotspot.status} />}
          {animalHash(hotspot.address)}
          {isOnDenylist && (
            <span className="text-xs font-sans text-white bg-red-400 rounded-md p-1 ml-1 mt-0.5 flex items-center justify-center">
              <DenylistIcon className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4 h-6 text-gray-525 text-xs md:text-sm whitespace-nowrap">
          <RewardScaleHex rewardScale={hotspot?.rewardScale} />
          <HotspotRewards address={hotspot.address} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-4">
        <div className="flex items-center">
          <span className="whitespace-nowrap text-xs md:text-sm font-sans text-gray-525">
            <HotspotTimeAgo hotspot={hotspot} />
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <img alt="" src="/images/details-arrow.svg" />
      </div>
    </>
  )
}

export default HexHotspotsList
