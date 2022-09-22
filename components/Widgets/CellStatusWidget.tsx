import { memo, useMemo } from 'react'
import TimeAgo from 'react-time-ago'
import { CellHeartbeat } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import { isAfter, sub } from 'date-fns'
import StatusIcon from '../InfoBox/HotspotDetails/StatusIcon'

type Props = {
  index?: number
  showIndex?: boolean
  cellHotspot?: CellHeartbeat
}

export const isRadioActive = (cellHotspot: CellHeartbeat) => {
  if (!cellHotspot || !cellHotspot?.timestamp) return false

  const activeDate = sub(new Date(), { days: 1 })
  const timestamp = new Date(cellHotspot?.timestamp * 1000)

  return (
    cellHotspot?.timestamp &&
    timestamp &&
    isAfter(timestamp, activeDate) &&
    cellHotspot?.operationMode
  )
}

const CellStatusWidget = ({ index = 1, cellHotspot, showIndex }: Props) => {
  const timestamp = useMemo(() => {
    if (!cellHotspot?.timestamp) return undefined
    return new Date(cellHotspot?.timestamp * 1000)
  }, [cellHotspot?.timestamp])

  const status = useMemo(() => {
    if (!cellHotspot?.timestamp) {
      return 'Not Available'
    }

    if (isRadioActive(cellHotspot)) {
      return 'Active'
    }

    return 'Inactive'
  }, [cellHotspot])

  const category = useMemo(() => {
    switch (cellHotspot?.cbsdCategory) {
      case 'A':
        return 'Indoor'
      case 'B':
        return 'Outdoor'
      default:
        return 'Unknown'
    }
  }, [cellHotspot?.cbsdCategory])

  const serial = useMemo(() => {
    return cellHotspot?.cbsdId ? cellHotspot.cbsdId : null
  }, [cellHotspot?.cbsdId])

  return (
    <div className="col-span-2 flex flex-col rounded-lg bg-gray-200 p-3 py-4 font-medium">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <span className="pr-2 text-xl">
            {showIndex ? `Radio ${index}` : 'Radio'}
          </span>
          <StatusIcon
            status={status}
            tooltip="A radio is active if it has a heartbeat in the last 24 hours."
          />
        </div>
        <span className="mt-1 text-sm font-normal text-gray-600">{serial}</span>
      </div>
      <div className="my-4 h-px bg-gray-400" />
      <div className="flex flex-row">
        <div className="flex flex-col">
          <span className="pr-1 text-sm font-normal text-gray-600">Type</span>
          <span className="text-base">{category}</span>
        </div>
        <div className="flex flex-col pl-8">
          <span className="pr-1 text-sm font-normal text-gray-600">
            Last Heartbeat
          </span>
          <span className="text-base">
            {timestamp === undefined ? 'Unknown' : <TimeAgo date={timestamp} />}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(CellStatusWidget)
