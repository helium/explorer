import classNames from 'classnames'
import { useHotspotActivity } from '../../../data/activity'
import ActivityList from '../../Lists/ActivityList'

const ActivityPane = ({ hotspot }) => {
  const {
    transactions,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useHotspotActivity(hotspot.address)

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <ActivityList
        transactions={transactions}
        isLoading={isLoadingInitial}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMore}
        hasMore={hasMore}
      />
    </div>
  )
}

export default ActivityPane
