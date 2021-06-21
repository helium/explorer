import classNames from 'classnames'
import { useMemo } from 'react'
import { useAsync } from 'react-async-hook'
import { fetchNearbyHotspots } from '../../../data/hotspots'
import NearbyHotspotsList from '../../Lists/NearbyHotspotsList'

const NearbyHotspotsPane = ({ hotspot }) => {
  const { result: nearbyHotspots, loading } = useAsync(fetchNearbyHotspots, [
    hotspot.lat,
    hotspot.lng,
    5000,
  ])

  const hotspots = useMemo(() => {
    if (!nearbyHotspots) return []
    return nearbyHotspots.filter((h) => h.address !== hotspot.address)
  }, [hotspot.address, nearbyHotspots])

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
        showCount
        // description="[Nearby Hotspots description text]"
      />
    </div>
  )
}

export default NearbyHotspotsPane
