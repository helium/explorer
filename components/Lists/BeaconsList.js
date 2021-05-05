import { useCallback } from 'react'
import animalHash from 'angry-purple-tiger'
import TimeAgo from 'react-time-ago'
import FlagLocation from '../Common/FlagLocation'
import BaseList from './BaseList'
import WitnessPill from '../Common/WitnessPill'

const BeaconsList = ({
  beacons,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const handleSelectBeacon = useCallback((beacon) => {
    console.log('selecting beacon', beacon)
  }, [])

  const keyExtractor = useCallback((b) => b.hash, [])
  const linkExtractor = useCallback((b) => `/txns/${b.hash}`, [])

  const renderTitle = useCallback((b) => {
    return <FlagLocation geocode={b.path[0].geocode} />
  }, [])

  const renderSubtitle = useCallback((b) => {
    return <TimeAgo date={b.time * 1000} />
  }, [])

  const renderDetails = useCallback((b) => {
    return <WitnessPill count={b.path[0]?.witnesses?.length || 0} />
  }, [])

  return (
    <BaseList
      items={beacons}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectBeacon}
      isLoading={isLoading}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No Beacons"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
    />
  )
}

export default BeaconsList
