import { memo, useMemo } from 'react'
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

export const enum SpeedTestTier {
  ACCEPTABLE = 'Acceptable',
  DEGRADED = 'Degraded',
  POOR = 'Poor',
  FAIL = 'Fail',
}

/**
 * Converts megabits per second to bytes per second.
 * @param mbps
 */
const toBps = (mbps: number) => mbps * 125000

/**
 * Converts bytes per second to a megabits per second string.
 * @param bps
 */
const toMbps = (bps: number) => `${floor((bps * 8) / 10e5)} Mbps`

const CellSpeedtestWidget = ({ cellSpeedtest, loading }: Props) => {
  const timestamp = useMemo(() => {
    if (!cellSpeedtest?.timestamp) return undefined
    return new Date(cellSpeedtest?.timestamp * 1000)
  }, [cellSpeedtest?.timestamp])

  const downloadTier = useMemo(() => {
    const speed = cellSpeedtest?.downloadSpeed
    if (speed === undefined) return undefined

    if (speed >= toBps(100)) {
      return SpeedTestTier.ACCEPTABLE
    } else if (speed >= toBps(50)) {
      return SpeedTestTier.DEGRADED
    } else if (speed >= toBps(30)) {
      return SpeedTestTier.POOR
    }
    return SpeedTestTier.FAIL
  }, [cellSpeedtest?.downloadSpeed])

  const uploadTier = useMemo(() => {
    const speed = cellSpeedtest?.uploadSpeed
    if (speed === undefined) return undefined

    if (speed >= toBps(10)) {
      return SpeedTestTier.ACCEPTABLE
    } else if (speed >= toBps(5)) {
      return SpeedTestTier.DEGRADED
    } else if (speed >= toBps(2)) {
      return SpeedTestTier.POOR
    }
    return SpeedTestTier.FAIL
  }, [cellSpeedtest?.uploadSpeed])

  const latencyTier = useMemo(() => {
    const latency = cellSpeedtest?.latency
    if (latency === undefined) return undefined

    if (latency <= 50) {
      return SpeedTestTier.ACCEPTABLE
    } else if (latency <= 75) {
      return SpeedTestTier.DEGRADED
    } else if (latency <= 100) {
      return SpeedTestTier.POOR
    }
    return SpeedTestTier.FAIL
  }, [cellSpeedtest?.latency])

  const status = useMemo(() => {
    if (!cellSpeedtest) return 'Not Available'

    if (
      downloadTier === SpeedTestTier.FAIL ||
      uploadTier === SpeedTestTier.FAIL ||
      latencyTier === SpeedTestTier.FAIL
    ) {
      return SpeedTestTier.FAIL
    } else if (
      downloadTier === SpeedTestTier.POOR ||
      uploadTier === SpeedTestTier.POOR ||
      latencyTier === SpeedTestTier.POOR
    ) {
      return SpeedTestTier.POOR
    } else if (
      downloadTier === SpeedTestTier.DEGRADED ||
      uploadTier === SpeedTestTier.DEGRADED ||
      latencyTier === SpeedTestTier.DEGRADED
    ) {
      return SpeedTestTier.DEGRADED
    }
    return SpeedTestTier.ACCEPTABLE
  }, [cellSpeedtest, downloadTier, latencyTier, uploadTier])

  const rewardScale = useMemo(() => {
    switch (status) {
      case SpeedTestTier.ACCEPTABLE:
        return '1x Rewards'
      case SpeedTestTier.DEGRADED:
        return '0.5x Rewards'
      case SpeedTestTier.POOR:
        return '0.25x Rewards'
      default:
      case 'Not Available':
      case SpeedTestTier.FAIL:
        return '0x Rewards'
    }
  }, [status])

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
        <div className="flex flex-row items-center">
          <span className="pr-2 text-xl">Speed Test</span>
          <StatusIcon status={status} />
          <span className="text-l pl-2 font-bold">{rewardScale}</span>
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
          tier={downloadTier}
          acceptableRange="100+ Mbps"
          degradedRange="50-99 Mbps"
          poorRange="30-49 Mbps"
          failedRange="0-29 Mbps"
        />
        <SpeedtestStat
          title="Upload speed"
          className="mr-8"
          invalidData={!cellSpeedtest}
          value={toMbps(cellSpeedtest?.uploadSpeed)}
          tier={uploadTier}
          acceptableRange="10+ Mbps"
          degradedRange="5-9 Mbps"
          poorRange="2-4 Mbps"
          failedRange="0-1 Mbps"
        />
        <SpeedtestStat
          title="Latency"
          invalidData={!cellSpeedtest}
          value={`${cellSpeedtest?.latency} ms`}
          tier={latencyTier}
          acceptableRange="0-50 ms"
          degradedRange="51-75 ms"
          poorRange="76-100 ms"
          failedRange="101+ ms"
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
  tooltip?: string
  error?: string
  tier: SpeedTestTier
  acceptableRange: string
  degradedRange: string
  poorRange: string
  failedRange: string
}

const SpeedtestStat = ({
  title,
  value,
  invalidData,
  tooltip,
  acceptableRange,
  degradedRange,
  poorRange,
  failedRange,
  tier,
}: SpeedtestStatProps) => {
  return (
    <div className={'mb-6 flex w-1/2 flex-col text-base'}>
      <span className="mr-1 mb-1 text-sm font-normal text-gray-600">
        {title}
      </span>
      <span className="mb-1 w-12">
        <StatusIcon
          status={tier}
          hidden={!tier}
          tooltip={tooltip}
          showTooltipIcon={false}
        />
      </span>
      <span className="mb-1 font-bold">{invalidData ? 'Unknown' : value}</span>
      <span
        className={classNames('text-xs', {
          'text-green-300': tier === SpeedTestTier.ACCEPTABLE,
          'font-extrabold': tier === SpeedTestTier.ACCEPTABLE,
          'font-normal': tier !== SpeedTestTier.ACCEPTABLE,
        })}
      >
        {`Acceptable: ${acceptableRange}`}
      </span>
      <span
        className={classNames('text-xs', {
          'text-yellow-300': tier === SpeedTestTier.DEGRADED,
          'font-extrabold': tier === SpeedTestTier.DEGRADED,
          'font-normal': tier !== SpeedTestTier.DEGRADED,
        })}
      >
        {`Degraded: ${degradedRange}`}
      </span>
      <span
        className={classNames('text-xs', {
          'text-red-300': tier === SpeedTestTier.POOR,
          'font-extrabold': tier === SpeedTestTier.POOR,
          'font-normal': tier !== SpeedTestTier.POOR,
        })}
      >
        {`Poor: ${poorRange}`}
      </span>
      <span
        className={classNames('text-xs', {
          'text-black': tier === SpeedTestTier.FAIL,
          'font-extrabold': tier === SpeedTestTier.FAIL,
          'font-normal': tier !== SpeedTestTier.FAIL,
        })}
      >
        {`Failed: ${failedRange}`}
      </span>
    </div>
  )
}

export default memo(CellSpeedtestWidget)
