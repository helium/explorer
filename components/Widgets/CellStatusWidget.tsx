import { memo, useMemo } from 'react'
import TimeAgo from 'react-time-ago'
import { CellHeartbeat } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import { isAfter, sub } from 'date-fns'
import StatusIcon from '../InfoBox/HotspotDetails/StatusIcon'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import { InfoCircleOutlined } from '@ant-design/icons'

type Props = {
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

const CellStatusWidget = ({ cellHotspot }: Props) => {
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

  const operationMode = useMemo(() => {
    if (!cellHotspot) {
      return 'Unknown'
    }
    if (cellHotspot.operationMode) {
      return 'On Air'
    }
    return 'Offline'
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

  const last4OfSerial = useMemo(() => {
    if (!cellHotspot?.cbsdId) return ''
    const length = cellHotspot.cbsdId.length
    return cellHotspot.cbsdId.slice(length - 4, length)
  }, [cellHotspot?.cbsdId])

  return (
    <div className="col-span-2 flex flex-col rounded-lg bg-gray-200 p-3 py-4 font-medium">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <span className="pr-2 text-xl">{`Radio ${last4OfSerial}`}</span>
          <StatusIcon
            status={status}
            tooltip={
              'A radio is active if it has a heartbeat in the last 24 hours and an "On Air" operation mode.'
            }
          />
        </div>
      </div>
      <div className="my-4 h-px bg-gray-400" />
      <div className="flex flex-row flex-wrap justify-between">
        <div className="mb-1 flex flex-col">
          <span className="pr-1 text-sm font-normal text-gray-600">Type</span>
          <span className="text-base">{category}</span>
        </div>
        <div className="mb-1 flex flex-col ">
          <span className="pr-1 text-sm font-normal text-gray-600">
            Last Heartbeat
          </span>
          <span className="text-base">
            {timestamp === undefined ? 'Unknown' : <TimeAgo date={timestamp} />}
          </span>
        </div>
        <Tooltip
          title={"Check your radio's local dashboard for more information."}
        >
          <div className="mb-1 flex flex-col ">
            <span className="flex flex-row items-center pr-1 text-sm font-normal text-gray-600">
              Operation Mode
              <InfoCircleOutlined className="ml-1 text-gray-600" />
            </span>
            <span
              className={classNames('text-base', {
                'text-red-500': operationMode === 'Offline',
              })}
            >
              {operationMode}
            </span>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default memo(CellStatusWidget)
