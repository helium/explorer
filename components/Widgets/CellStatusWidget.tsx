import { memo, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { CellHotspot } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import { isAfter, sub } from 'date-fns'

type Props = {
  cellHotspot?: CellHotspot
}
const CellStatusWidget = ({ cellHotspot }: Props) => {
  const timestamp = useMemo(() => {
    if (!cellHotspot?.lastHeartbeat) return undefined
    return new Date(cellHotspot?.lastHeartbeat)
  }, [cellHotspot?.lastHeartbeat])

  const loading = useMemo(() => !cellHotspot, [cellHotspot])

  const status = useMemo(() => {
    const activeDate = sub(new Date(), { days: 1 })

    if (!cellHotspot?.lastHeartbeat) {
      return 'Not Available'
    }

    if (cellHotspot?.lastHeartbeat && timestamp && isAfter(timestamp, activeDate)) {
      return 'Active'
    }

    return 'Inactive'
  }, [cellHotspot?.lastHeartbeat, timestamp])

  const subtitle = useMemo(() => {
    if (cellHotspot?.lastHeartbeat && timestamp) {
      return (
        <span className="text-gray-550 text-sm font-sans">
          Last active <TimeAgo date={timestamp} />
        </span>
      )
  }

    return null
  }, [cellHotspot?.lastHeartbeat, timestamp])

  return (
    // @ts-ignore
    <Widget
      title="Small Cell Status"
      value={status}
      subtitle={subtitle}
      isLoading={loading}
      span={2}
      tooltip="A 5G Hotspot is active if it has a heartbeat in the last 24 hours."
      icon={
        !loading && status !== 'Not Available' &&
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
