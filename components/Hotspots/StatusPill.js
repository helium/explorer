import { memo, useMemo } from 'react'
import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import { fetchHeightByTimestamp } from '../../data/blocks'
import { SYNC_BUFFER_BLOCKS } from './utils'

const StatusPill = ({ hotspot }) => {
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

  if (syncHeightLoading) return null

  return (
    <div className="flex flex-row items-center justify-center py-0.5 px-2.5 bg-navy-600 rounded-full">
      <div
        className={classNames('h-2.5', 'w-2.5', 'rounded-full', {
          'bg-green-500': status === 'online',
          'bg-red-400': status === 'offline',
        })}
      />
      <p className="text-gray-600 ml-2 mb-0">{value}</p>
    </div>
  )
}

export default memo(StatusPill)
