import { memo, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { CellHeartbeat } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import { isAfter, sub } from 'date-fns'

type Props = {
  heartbeat?: CellHeartbeat
}
const CellStatusWidget = ({ heartbeat }: Props) => {
  const timestamp = useMemo(() => new Date(heartbeat?.timestamp),
    [heartbeat?.timestamp])

  const status = useMemo(() => {
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
      title="Small Cell Status"
      value={status}
      subtitle={subtitle}
      tooltip="A 5G Hotspot is active if it has a heartbeat in the last 10 minutes."
      icon={
        <div
          className={classNames('rounded-full w-5 h-5', {
            'bg-green-400': status === 'Active',
            'bg-yellow-400': status === 'Inactive',
          })}
        />
      }
    />
  )
}

export default memo(CellStatusWidget)
