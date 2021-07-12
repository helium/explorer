import { Tooltip } from 'antd'
import classNames from 'classnames'

const StatusPill = ({ hotspot }) => {
  const status = hotspot.status.online
  return (
    <Tooltip
      placement="top"
      title={`Hotspot is ${status}. ${
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
            : hotspot.block - hotspot.status?.height >= 1500 ||
              hotspot.status.height === null
            ? `Syncing`
            : `Synced`}
        </p>
      </div>
    </Tooltip>
  )
}

export default StatusPill
