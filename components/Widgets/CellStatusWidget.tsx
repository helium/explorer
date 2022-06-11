import { memo, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { Hotspot } from '@helium/http'
import { CellHeartbeat } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import { isAfter, sub } from 'date-fns'

type Props = {
  hotspot: Hotspot
  heartbeat?: CellHeartbeat
}
const CellStatusWidget = ({ hotspot, heartbeat }: Props) => {
  const timestamp = useMemo(() => new Date(heartbeat?.timestamp),
    [heartbeat?.timestamp])

  const value = useMemo(() => {
    const activeDate = sub(new Date(), { minutes: 10 })

    if (heartbeat && isAfter(timestamp, activeDate)) {
      return 'Active'
    }

    return 'Inactive'
  }, [heartbeat, timestamp])

  const subtitle = useMemo(() => {
    if (heartbeat?.timestamp) {
      return (
        <span className="text-gray-550 text-sm font-sans">
          Last active <TimeAgo date={timestamp} />
        </span>
      )
  }

    return null
  }, [heartbeat?.timestamp, timestamp])

  return (
    // @ts-ignore
    <Widget
      title="Status"
      value={value}
      span={2}
      subtitle={subtitle}
      tooltip="A 5G Hotspot is active if it has a heartbeat in the last 10 minutes."
      icon={
        <div
          className={classNames('rounded-full w-5 h-5', {
            'bg-green-400': value === 'Active',
            'bg-yellow-400': value === 'Inactive',
          })}
        />
      }
    />
  )
}

export default memo(CellStatusWidget)
