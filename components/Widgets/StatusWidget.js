import { memo, useMemo } from 'react'
import classNames from 'classnames'
import Widget from './Widget'
import { useAsync } from 'react-async-hook'

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

    if (hotspot.block - syncHeight >= 1500 || hotspot.status.height === null) {
      return 'Syncing'
    }

    return 'Synced'
  }, [hotspot.block, hotspot.status.height, status, syncHeight])

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
      subtitle={
        value === 'Syncing' && (
          <span className="text-gray-550">
            At block {syncHeight?.toLocaleString()}
          </span>
        )
      }
    />
  )
}

const fetchHeightByTimestamp = async (timestamp) => {
  const response = await fetch(
    `https://api.helium.io/v1/blocks/height?max_time=${timestamp}`,
  )
  const {
    data: { height },
  } = await response.json()
  return height
}

export default memo(StatusWidget)
