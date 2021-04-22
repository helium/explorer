import { useMemo } from 'react'
import classNames from 'classnames'
import Widget from './Widget'

const StatusWidget = ({ hotspot }) => {
  const status = hotspot?.status?.online

  const value = useMemo(() => {
    if (status === 'offline') {
      return 'Offline'
    }
    if (
      hotspot.block - hotspot.status?.height >= 500 ||
      hotspot.status.height === null
    ) {
      return 'Syncing'
    }
    return 'Synced'
  }, [hotspot.block, hotspot.status.height, status])

  return (
    <Widget
      title="Sync Status"
      value={value}
      icon={
        <div
          className={classNames('rounded-full w-5 h-5', {
            'bg-green-400': status === 'online',
            'bg-red-400': status === 'offline',
          })}
        />
      }
      subtitle={
        <span className="text-gray-550">
          At block {hotspot?.status?.height?.toLocaleString()}
        </span>
      }
    />
  )
}

export default StatusWidget
