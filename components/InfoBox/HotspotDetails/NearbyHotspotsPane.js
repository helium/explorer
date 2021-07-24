import classNames from 'classnames'
import { useMemo } from 'react'
import { useAsync } from 'react-async-hook'
import { fetchNearbyHotspots } from '../../../data/hotspots'
import NearbyHotspotsList from '../../Lists/NearbyHotspotsList'
import animalHash from 'angry-purple-tiger'

const NearbyHotspotsPane = ({ hotspot }) => {
  const { result: nearbyHotspots, loading } = useAsync(fetchNearbyHotspots, [
    hotspot?.lat,
    hotspot?.lng,
    5000,
  ])

  const hotspots = useMemo(() => {
    if (!nearbyHotspots) return []
    return nearbyHotspots.filter((h) => h.address !== hotspot.address)
  }, [hotspot?.address, nearbyHotspots])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !loading,
        'overflow-y-hidden': loading,
      })}
    >
      <NearbyHotspotsList
        hotspots={hotspots || []}
        isLoading={loading}
        title="Nearby Hotspots"
        description={`Hotspots that are close enough that ${
          hotspot ? animalHash(hotspot.address) : 'this Hotspot'
        } could witness them or have its beacons witnessed by them. The probability of Hotspots interacting with each other depends on antenna location, position, and elevation.`}
        showCount
      />
    </div>
  )
}

export default NearbyHotspotsPane
