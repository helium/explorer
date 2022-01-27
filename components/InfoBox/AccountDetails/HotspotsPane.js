import classNames from 'classnames'
import { useAccount } from '../../../data/accounts'
import { useHotspots } from '../../../data/hotspots'
import HotspotsList from '../../Lists/HotspotsList'

const HotspotsPane = ({ address }) => {
  const { account } = useAccount(address)
  const { hotspots, fetchMore, isLoadingInitial, isLoadingMore, hasMore } =
    useHotspots('account', address)

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
        count={account?.hotspotCount}
        showCount
      />
    </div>
  )
}

export default HotspotsPane
