import { memo, useMemo } from 'react'
import classNames from 'classnames'
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
