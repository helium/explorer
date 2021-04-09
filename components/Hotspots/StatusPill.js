import { Tooltip } from 'antd'
import classNames from 'classnames'

const StatusPill = ({ hotspot }) => {
  const status = hotspot.status.online
  return (
    <div className="flex flex-row items-center justify-center py-0.5 px-2.5 bg-navy-600 rounded-full">
      <Tooltip placement="top" title={`Hotspot is ${status}`}>
        <div
          className={classNames('h-2.5', 'w-2.5', 'rounded-full', {
            'bg-green-500': status === 'online',
            'bg-red-400': status === 'offline',
          })}
        />
      </Tooltip>
      <Tooltip
        placement="top"
        title={`${
          status === 'online' && hotspot.status.height === null
            ? 'Beginning to sync'
            : status === 'online' && hotspot.status.height !== null
            ? `Syncing block ${hotspot.status?.height.toLocaleString()}. `
            : 'Hotspot is not syncing. '
        }${
          status === 'online' && hotspot.status.height !== null
            ? `Blocks remaining: ${(
                hotspot.block - hotspot.status?.height
              ).toLocaleString()}.`
            : ``
        }`}
      >
        <p className="text-gray-600 ml-2 mb-0">
          {status === 'offline'
            ? `Offline`
            : hotspot.block - hotspot.status?.height >= 500 ||
              hotspot.status.height === null
            ? `Syncing`
            : `Synced`}
        </p>
      </Tooltip>
    </div>
  )
}

export default StatusPill
