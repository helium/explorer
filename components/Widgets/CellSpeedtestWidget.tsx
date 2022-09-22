import { useMemo } from 'react'
import classNames from 'classnames'
import { floor } from 'lodash'
import { formatDistanceToNow } from 'date-fns'
import { CellSpeedtest } from '../InfoBox/HotspotDetails/CellStatisticsPane'
import StatusIcon from '../InfoBox/HotspotDetails/StatusIcon'

type Props = {
  cellSpeedtest?: CellSpeedtest
}

const toMbps = (num: number) => `${floor((num * 8) / 10e5)} Mbps`

const CellSpeedtestWidget = ({ cellSpeedtest }: Props) => {
  const timestamp = useMemo(() => {
    if (!cellSpeedtest?.timestamp) return undefined
    return new Date(cellSpeedtest?.timestamp * 1000)
  }, [cellSpeedtest?.timestamp])

  const status = useMemo(() => {
    if (!cellSpeedtest) return 'Unknown'

    if (
      cellSpeedtest?.downloadSpeed < 12500000 ||
      cellSpeedtest?.uploadSpeed < 1250000 ||
      cellSpeedtest?.latency > 50
    ) {
      return 'Failed'
    }

    return 'Passed'
  }, [cellSpeedtest])

  return (
    <div className="col-span-2 flex flex-col rounded-lg bg-gray-200 p-3 py-4 font-medium">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <span className="pr-2 text-xl">Speed Test</span>
          <StatusIcon status={status} />
        </div>
        {timestamp && (
          <span className="mt-1 text-sm font-normal text-gray-600">
            Last measured {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        )}
      </div>
      <div className="my-4 h-px bg-gray-400" />
      <SpeedtestStat
        title="Download speed"
        value={toMbps(cellSpeedtest?.downloadSpeed)}
        error={
          cellSpeedtest?.downloadSpeed < 12500000
            ? '(min accepted 100 Mbps)'
            : null
        }
      />
      <SpeedtestStat
        title="Upload speed"
        value={toMbps(cellSpeedtest?.uploadSpeed)}
        error={
          cellSpeedtest?.uploadSpeed < 1250000 ? '(min accepted 10 Mbps)' : null
        }
      />
      <SpeedtestStat
        title="Latency"
        value={`${cellSpeedtest?.latency} ms`}
        error={cellSpeedtest?.latency > 50 ? '(max accepted 50 ms)' : null}
      />
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
  error?: string
}

const SpeedtestStat = ({ title, value, error }: SpeedtestStatProps) => {
  return (
    <div
      className={classNames('text-base', {
        'text-gray-600': !error,
        'text-red-400': !!error,
      })}
    >
      <span className="mr-1 font-normal">{title}:</span>
      <span>{value}</span>
      <span className="ml-1 font-normal">{error}</span>
    </div>
  )
}

export default CellSpeedtestWidget
