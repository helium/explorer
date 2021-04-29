import classNames from 'classnames'
import { useBeacons } from '../../../data/beacons'
import BeaconsList from '../../Lists/BeaconsList'

const BeaconsPane = ({ context, address }) => {
  const {
    items: beacons,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useBeacons(context, address)

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <BeaconsList
        beacons={beacons}
        isLoading={isLoadingInitial}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMore}
        hasMore={hasMore}
      />
    </div>
  )
}

export default BeaconsPane
