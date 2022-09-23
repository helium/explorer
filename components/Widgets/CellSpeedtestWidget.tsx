import { useMemo } from 'react'
import classNames from 'classnames'
import { floor } from 'lodash'
import { formatDistanceToNow } from 'date-fns'
import { CellSpeedtest } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import StatusIcon from '../InfoBox/HotspotDetails/StatusIcon'
import { Skeleton } from 'antd'

type Props = {
  cellSpeedtest?: CellSpeedtest
  loading: boolean
}

const toMbps = (num: number) => `${floor((num * 8) / 10e5)} Mbps`

const CellSpeedtestWidget = ({ cellSpeedtest, loading }: Props) => {
  const timestamp = useMemo(() => {
    if (!cellSpeedtest?.timestamp) return undefined
    return new Date(cellSpeedtest?.timestamp * 1000)
  }, [cellSpeedtest?.timestamp])

  const status = useMemo(() => {
    if (!cellSpeedtest) return 'Not Available'

    if (
      cellSpeedtest?.downloadSpeed < 12500000 ||
      cellSpeedtest?.uploadSpeed < 1250000 ||
      cellSpeedtest?.latency > 50
    ) {
      return 'Fail'
    }

    return 'Pass'
  }, [cellSpeedtest])

  if (loading) {
    return (
      <div className="col-span-2 rounded-lg bg-gray-200 p-3">
        <Skeleton />
      </div>
    )
  }

  return (
    <div className="col-span-2 flex flex-col rounded-lg bg-gray-200 p-3 py-4 font-medium">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <span className="pr-2 text-xl">Speed Test</span>
          <StatusIcon
            status={status}
            tooltip="A passing speed test must have >100 Mbps download, >10 Mbps upload, and <50 ms latency."
          />
        </div>
        {timestamp && (
          <span className="mt-1 text-sm font-normal text-gray-600">
            Last measured {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        )}
      </div>
      <div className="my-4 h-px bg-gray-400" />
      <div className="flex flex-row flex-wrap">
        <SpeedtestStat
          title="Download speed"
          className="mr-8"
          invalidData={!cellSpeedtest}
          value={toMbps(cellSpeedtest?.downloadSpeed)}
          error={
            cellSpeedtest?.downloadSpeed < 12500000
              ? '(min accepted 100 Mbps)'
              : null
          }
        />
        <SpeedtestStat
          title="Upload speed"
          className="mr-8"
          invalidData={!cellSpeedtest}
          value={toMbps(cellSpeedtest?.uploadSpeed)}
          error={
            cellSpeedtest?.uploadSpeed < 1250000
              ? '(min accepted 10 Mbps)'
              : null
          }
        />
        <SpeedtestStat
          title="Latency"
          invalidData={!cellSpeedtest}
          value={`${cellSpeedtest?.latency} ms`}
          error={cellSpeedtest?.latency > 50 ? '(max accepted 50 ms)' : null}
        />
      </div>
      <span className="mt-2 break-normal pr-6 text-xs font-light text-gray-600">
        Speed Test Results are based on the last known value and are for
        informational purposes only. This does not impact Genesis Rewards at
        this time.
      </span>
    </div>
  )
}

type SpeedtestStatProps = {
  title: string
  value: string
  invalidData: boolean
  className?: string
  error?: string
}

const SpeedtestStat = ({
  title,
  value,
  error,
  invalidData,
  className,
}: SpeedtestStatProps) => {
  const status = useMemo(() => {
    if (invalidData) return 'Unknown'
    return !!error ? 'Fail' : 'Pass'
  }, [error, invalidData])

  return (
    <div
      className={classNames(className, 'mb-2 flex flex-col text-base', {
        'text-red-400': !!error,
      })}
    >
      <span className="mr-1 mb-1 text-sm font-normal text-gray-600">
        {title}
      </span>
      <span className="mb-1 w-12">
        <StatusIcon status={status} hidden={status === 'Unknown'} />
      </span>
      <span>{invalidData ? 'Unknown' : value}</span>
      <span className="text-xs font-normal">{error}</span>
    </div>
  )
}

export default CellSpeedtestWidget
