import { memo } from 'react'
import { Tooltip } from 'antd'
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

  if (syncHeightLoading) return null

  return (
    <Tooltip
      placement="top"
      title={`Hotspot is ${status}. ${
        status === 'online' &&
        syncHeight !== null &&
        hotspot.block - syncHeight <= SYNC_BUFFER_BLOCKS
          ? 'Synced.'
          : status === 'online' && syncHeight !== null
          ? `Syncing block ${syncHeight.toLocaleString()}. `
          : 'Hotspot is not syncing. '
      }${
        status === 'online' &&
        syncHeight !== null &&
        hotspot.block - syncHeight >= SYNC_BUFFER_BLOCKS
          ? `Blocks remaining: ${(
              hotspot.block - syncHeight
            ).toLocaleString()}.`
          : ``
      }`}
    >
      <div className="flex flex-row items-center justify-center py-0.5 px-2.5 bg-navy-600 rounded-full">
        <div
          className={classNames('h-2.5', 'w-2.5', 'rounded-full', {
            'bg-green-500': status === 'online',
            'bg-red-400': status === 'offline',
          })}
        />
        <p className="text-gray-600 ml-2 mb-0">
          {status === 'offline'
            ? `Offline`
            : hotspot.block - syncHeight >= SYNC_BUFFER_BLOCKS ||
              syncHeight === null
            ? `Syncing`
            : `Synced`}
        </p>
      </div>
    </Tooltip>
  )
}

export default memo(StatusPill)
