import { useCallback } from 'react'
import animalHash from 'angry-purple-tiger'
import StatusCircle from '../Hotspots/StatusCircle'
import FlagLocation from '../Common/FlagLocation'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import BaseList from './BaseList'
import Gain from '../Hotspots/Gain'
import Elevation from '../Hotspots/Elevation'
import Rewards from '../Hotspots/Rewards'
import TransmitScale from '../Hotspots/TransmitScale'

const HotspotsList = ({
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
        <FlagLocation
          location={h.location}
          geocode={h.geocode}
          shortenedLocationName
        />
        <TransmitScale hotspot={h} />
        <Gain hotspot={h} />
        <Elevation hotspot={h} />
        <Rewards hotspot={h} />
      </>
    )
  }, [])

  const renderDetails = useCallback((h) => {
    return <span className="whitespace-nowrap text-xs"></span>
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
      blankTitle="No Hotspots"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
    />
  )
}

export default HotspotsList
