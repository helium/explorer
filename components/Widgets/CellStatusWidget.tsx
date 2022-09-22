import { memo, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { CellHeartbeat } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import { isAfter, sub } from 'date-fns'

type Props = {
  index: number
  cellHotspot?: CellHeartbeat
}
const CellStatusWidget = ({ index, cellHotspot }: Props) => {
  const timestamp = useMemo(() => {
    if (!cellHotspot?.timestamp) return undefined
    return new Date(cellHotspot?.timestamp * 1000)
  }, [cellHotspot?.timestamp])

  const loading = useMemo(() => !cellHotspot, [cellHotspot])

  const status = useMemo(() => {
    const activeDate = sub(new Date(), { days: 1 })

    if (!cellHotspot?.timestamp) {
      return 'Not Available'
    }

    if (cellHotspot?.timestamp
      && timestamp && isAfter(timestamp, activeDate)
      && cellHotspot?.operationMode) {
      return 'Active'
    }

    return 'Inactive'
  }, [cellHotspot?.operationMode, cellHotspot?.timestamp, timestamp])

  const StatusIcon = useCallback(() => {
    return (
      !loading && status !== 'Not Available' &&
      <div
        className={classNames('rounded-full w-3 h-3 mr-1', {
          'bg-green-400': status === 'Active',
          'bg-yellow-400': status === 'Inactive',
        })}
      />
    )
  }, [loading, status])

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
    return cellHotspot?.cbsdId ? cellHotspot.cbsdId : 'Unknown'
  }, [cellHotspot?.cbsdId])

  const subtitle = useMemo(() => {
    if (cellHotspot?.timestamp && timestamp) {
      return (
        <span className='text-gray-550 text-sm font-sans'>
          Last active <TimeAgo date={timestamp} />
        </span>
      )
    }
    return null
  }, [cellHotspot?.timestamp, timestamp])

  return (
    // @ts-ignore
    <Widget
      title={`Small Cell ${index}`}
      value={
        <div className='flex flex-col py-1'>
          <div className='flex flex-row items-center'>
            <span className='text-base font-normal text-gray-600 pr-1'>
              Status:
            </span>
            <StatusIcon />
            <span className='text-base text-gray-600'>{status}</span>
          </div>
          <div className='flex flex-row items-center'>
            <span className='text-base font-normal text-gray-600 pr-1'>
              Type:
            </span>
            <span className='text-base text-gray-600'>
              {category}
            </span>
          </div>
          <div className='flex flex-row items-center'>
            <span className='text-base font-normal text-gray-600 pr-1'>
              Serial:
            </span>
            <span className='text-base text-gray-600'>
              {serial}
            </span>
          </div>
        </div>
      }
      subtitle={subtitle}
      isLoading={loading}
      subtitleLoading={loading}
      span={2}
      tooltip='A 5G Hotspot is active if it has a heartbeat in the last 24 hours.'
    />
  )
}

export default memo(CellStatusWidget)
