import { useMemo } from 'react'
import classNames from 'classnames'
import { floor } from 'lodash'
import { formatDistanceToNow } from 'date-fns'
import Widget from './Widget'
import { CellSpeedtest } from '../InfoBox/HotspotDetails/CellStatisticsPane'

type Props = {
  cellSpeedtest?: CellSpeedtest
}

const toMbps = (num: number) => `${floor((num * 8) / 10e5)} Mbps`

const CellSpeedtestWidget = ({ cellSpeedtest }: Props) => {
  const loading = useMemo(() => !cellSpeedtest, [cellSpeedtest])

  const timestamp = useMemo(() => {
    if (!cellSpeedtest?.timestamp) return undefined
    return new Date(cellSpeedtest?.timestamp * 1000)
  }, [cellSpeedtest?.timestamp])

  return (
    // @ts-ignore
    <Widget
      title="Speed Test"
      value={
        <div>
          <div>
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
                cellSpeedtest?.uploadSpeed < 1250000
                  ? '(min accepted 10 Mbps)'
                  : null
              }
            />
            <SpeedtestStat
              title="Latency"
              value={`${cellSpeedtest?.latency} ms`}
              error={
                cellSpeedtest?.latency > 50 ? '(max accepted 50 ms)' : null
              }
            />
          </div>
          {timestamp && (
            <p className="mt-2 text-sm font-normal text-gray-600">
              Last measured{' '}
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </p>
          )}
          <p className="mt-2 break-normal pr-6 text-xs font-light text-gray-600">
            Speed Test Results are based on the last known value and are for
            informational purposes only. This does not impact Genesis Rewards at
            this time.
          </p>
        </div>
      }
      isLoading={loading}
      subtitleLoading={loading}
      span={2}
    />
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
