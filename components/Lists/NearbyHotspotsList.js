import { useCallback } from 'react'
import animalHash from 'angry-purple-tiger'
import StatusCircle from '../Hotspots/StatusCircle'
import FlagLocation from '../Common/FlagLocation'
import Hex from '../Hex'
import {
  formatDistance,
  formatLocation,
  generateRewardScaleColor,
} from '../Hotspots/utils'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import BaseList from './BaseList'

const NearbyHotspotsList = ({ hotspots, isLoading = true }) => {
  const { selectHotspot } = useSelectedHotspot()

  const handleSelectHotspot = useCallback((hotspot) => {
    selectHotspot(hotspot.address)
  }, [])

  const keyExtractor = useCallback((h) => h.address, [])

  const linkExtractor = useCallback((h) => `/hotspots/${h.address}`, [])

  const renderTitle = useCallback((h) => {
    return (
      <>
        <StatusCircle status={h.status} />
        {animalHash(h.address)}
      </>
    )
  }, [])

  const renderSubtitle = useCallback((h) => {
    return (
      <>
        <span className="flex items-center justify-start">
          <FlagLocation geocode={h.geocode} showLocationName={false} />
          {formatLocation(h.geocode, 'short')}
        </span>
        <span className="flex items-center">
          <Hex
            width={10}
            height={12}
            fillColor={generateRewardScaleColor(h?.rewardScale)}
          />
          <span className="ml-1">{h?.rewardScale?.toFixed(2)}</span>
        </span>
      </>
    )
  }, [])

  const renderDetails = useCallback((h) => {
    return (
      <span className="whitespace-nowrap">{formatDistance(h.distance)}</span>
    )
  }, [])

  return (
    <BaseList
      items={hotspots}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectHotspot}
      isLoading={isLoading}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No nearby Hotspots"
    />
  )
}

export default NearbyHotspotsList
