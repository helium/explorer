import { memo, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { useAsync } from 'react-async-hook'
import { fetchHeightByTimestamp } from '../../data/blocks'
import { SYNC_BUFFER_BLOCKS } from '../Hotspots/utils'

const StatusWidget = ({ hotspot }) => {
  const status = hotspot?.status?.online

  const {
    result: syncHeight,
    loading: syncHeightLoading,
  } = useAsync(async () => {
    const timestamp = hotspot?.status?.timestamp

    if (!timestamp) {
      return 1
    }

    const height = await fetchHeightByTimestamp(timestamp)
    return height
  }, [hotspot.status.timestamp])

  const value = useMemo(() => {
    if (status === 'offline') {
      return 'Offline'
    }

    if (
      !hotspot?.status?.height ||
      !syncHeight ||
      hotspot.status.height - syncHeight >= SYNC_BUFFER_BLOCKS
    ) {
      return 'Syncing'
    }

    return 'Synced'
  }, [hotspot.status.height, status, syncHeight])

  return (
    <Widget
      title="Sync Status"
      value={value}
      subtitle={
        hotspot?.status?.timestamp && (
          <span>
            As of <TimeAgo date={hotspot?.status?.timestamp} />
          </span>
        )
      }
      tooltip="Hotspots gossip their sync status over the p2p network. Pair with a hotspot over Bluetooth to get the most up-to-date sync status."
      isLoading={syncHeightLoading}
      icon={
        <div
          className={classNames('rounded-full w-5 h-5', {
            'bg-green-400': status === 'online',
            'bg-red-400': status === 'offline',
          })}
        />
      }
    />
  )
}

export default memo(StatusWidget)
