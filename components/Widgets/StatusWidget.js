import { memo, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'

const StatusWidget = ({ hotspot }) => {
  const status = hotspot?.status?.online

  const value = useMemo(() => {
    if (status === 'offline') {
      return 'Offline'
    }

    return 'Connected'
  }, [status])

  return (
    <Widget
      title="Sync Status"
      value={value}
      subtitle={
        hotspot?.status?.timestamp && (
          <span className="text-gray-550 text-sm font-sans">
            Last Updated <TimeAgo date={hotspot?.status?.timestamp} />
          </span>
        )
      }
      tooltip="Hotspots gossip their sync status over the p2p network. Pair with a hotspot over Bluetooth to get the most up-to-date sync status."
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
