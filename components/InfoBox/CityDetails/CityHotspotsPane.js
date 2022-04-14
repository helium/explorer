import classNames from 'classnames'
import { useHotspots } from '../../../data/hotspots'
import HotspotsList from '../../Lists/HotspotsList'
import SkeletonList from '../../Lists/SkeletonList'

const CityHotspotsPane = ({ city }) => {
  const { hotspots, fetchMore, isLoadingInitial, isLoadingMore, hasMore } =
    useHotspots('city', city?.cityId)

  if (!city || isLoadingInitial) return <SkeletonList />
  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <HotspotsList
        hotspots={hotspots}
        isLoading={isLoadingInitial}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMore}
        hasMore={hasMore}
      />
    </div>
  )
}

export default CityHotspotsPane
