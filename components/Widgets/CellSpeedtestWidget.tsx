import React, { memo, useMemo } from 'react'
import classNames from 'classnames'
import { floor } from 'lodash'
import { formatDistanceToNow } from 'date-fns'
import {
  CellAvgSpeedtest,
  SpeedTestValidity,
} from '../InfoBox/HotspotDetails/CellStatisticsPane'
import StatusIcon from '../InfoBox/HotspotDetails/StatusIcon'
import { Skeleton, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

type Props = {
  cellSpeedtest?: CellAvgSpeedtest
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

  const notEnoughData = useMemo(() => {
    if (!cellSpeedtest) return false
    return cellSpeedtest.validity === SpeedTestValidity.TOO_FEW_SAMPLES
  }, [cellSpeedtest])

  const downloadTier = useMemo(() => {
    const speed = cellSpeedtest?.downloadSpeedAvgBps
    if (speed === undefined || notEnoughData) return undefined

    if (speed >= toBps(100)) {
      return SpeedTestTier.ACCEPTABLE
    } else if (speed >= toBps(50)) {
      return SpeedTestTier.DEGRADED
    } else if (speed >= toBps(30)) {
      return SpeedTestTier.POOR
    }
    return SpeedTestTier.FAIL
  }, [cellSpeedtest?.downloadSpeedAvgBps, notEnoughData])

  const uploadTier = useMemo(() => {
    const speed = cellSpeedtest?.uploadSpeedAvgBps
    if (speed === undefined || notEnoughData) return undefined

    if (speed >= toBps(10)) {
      return SpeedTestTier.ACCEPTABLE
    } else if (speed >= toBps(5)) {
      return SpeedTestTier.DEGRADED
    } else if (speed >= toBps(2)) {
      return SpeedTestTier.POOR
    }
    return SpeedTestTier.FAIL
  }, [cellSpeedtest?.uploadSpeedAvgBps, notEnoughData])

  const latencyTier = useMemo(() => {
    const latency = cellSpeedtest?.latencyAvgMs
    if (latency === undefined || notEnoughData) return undefined

    if (latency <= 50) {
      return SpeedTestTier.ACCEPTABLE
    } else if (latency <= 75) {
      return SpeedTestTier.DEGRADED
    } else if (latency <= 100) {
      return SpeedTestTier.POOR
    }
    return SpeedTestTier.FAIL
  }, [cellSpeedtest?.latencyAvgMs, notEnoughData])

  const status = useMemo(() => {
    if (!cellSpeedtest) return 'Not Available'
    if (notEnoughData) return 'Not Enough Data'

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
  }, [cellSpeedtest, downloadTier, latencyTier, notEnoughData, uploadTier])

  const multiplier = useMemo(() => {
    if (!cellSpeedtest) return 0
    return cellSpeedtest.rewardMultiplier
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
        <div className="flex flex-row items-center">
          <span className="pr-2 text-xl font-bold">Speed Test</span>
          <StatusIcon
            status={status}
            tooltip="A 5G Hotspot automatically performs a Speed Test twice in
            24 hours at random times. The MOBILE PoC Oracle averages the results."
          />
        </div>
        {timestamp && (
          <span className="mt-1 text-sm font-normal text-gray-600">
            Last measured {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        )}
        {notEnoughData && (
          <span className="mb-1 text-sm font-normal text-gray-600">
            At least 2 Speed Tests are required
          </span>
        )}
        <div className="flex flex-row items-center">
          <span className="text-l align-center pt-1 font-bold">
            {`Speed Test Rewards Multiplier: ${multiplier}x`}
          </span>
          <Tooltip
            title="Speed Test multiplier is used together with Radio type
            multiplier to scale the MOBILE rewards."
          >
            <InfoCircleOutlined className="ml-1 mt-1 text-gray-600" />
          </Tooltip>
        </div>
      </div>
      <div className="my-4 h-px bg-gray-400" />
      <div className="flex flex-row flex-wrap">
        <SpeedtestStat
          title="Avg Download Speed"
          className="mr-8"
          invalidData={!cellSpeedtest || notEnoughData}
          value={toMbps(cellSpeedtest?.downloadSpeedAvgBps)}
          tier={downloadTier}
          acceptableRange="100+ Mbps"
          degradedRange="50-99 Mbps"
          poorRange="30-49 Mbps"
          failedRange="0-29 Mbps"
        />
        <SpeedtestStat
          title="Avg Upload Speed"
          className="mr-8"
          invalidData={!cellSpeedtest || notEnoughData}
          value={toMbps(cellSpeedtest?.uploadSpeedAvgBps)}
          tier={uploadTier}
          acceptableRange="10+ Mbps"
          degradedRange="5-9 Mbps"
          poorRange="2-4 Mbps"
          failedRange="0-1 Mbps"
        />
        <SpeedtestStat
          title="Avg Latency"
          invalidData={!cellSpeedtest || notEnoughData}
          value={`${cellSpeedtest?.latencyAvgMs} ms`}
          tier={latencyTier}
          acceptableRange="0-50 ms"
          degradedRange="51-75 ms"
          poorRange="76-100 ms"
          failedRange="101+ ms"
        />
      </div>
      <span className="mt-2 break-normal pr-6 text-xs font-light text-gray-600">
        Speed Test results averages are for informational purposes only. These
        values do not impact Genesis Rewards at this time.
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
      <span className="mb-1 font-bold">{invalidData ? 'N/A' : value}</span>
      <span
        className={classNames('text-xs', {
          'text-green-300': tier === SpeedTestTier.ACCEPTABLE,
          'font-extrabold': tier === SpeedTestTier.ACCEPTABLE,
          'font-normal': tier !== SpeedTestTier.ACCEPTABLE,
          hidden: invalidData,
        })}
      >
        {`Acceptable: ${acceptableRange}`}
      </span>
      <span
        className={classNames('text-xs', {
          'text-yellow-300': tier === SpeedTestTier.DEGRADED,
          'font-extrabold': tier === SpeedTestTier.DEGRADED,
          'font-normal': tier !== SpeedTestTier.DEGRADED,
          hidden: invalidData,
        })}
      >
        {`Degraded: ${degradedRange}`}
      </span>
      <span
        className={classNames('text-xs', {
          'text-red-300': tier === SpeedTestTier.POOR,
          'font-extrabold': tier === SpeedTestTier.POOR,
          'font-normal': tier !== SpeedTestTier.POOR,
          hidden: invalidData,
        })}
      >
        {`Poor: ${poorRange}`}
      </span>
      <span
        className={classNames('text-xs', {
          'text-black': tier === SpeedTestTier.FAIL,
          'font-extrabold': tier === SpeedTestTier.FAIL,
          'font-normal': tier !== SpeedTestTier.FAIL,
          hidden: invalidData,
        })}
      >
        {`Failed: ${failedRange}`}
      </span>
    </div>
  )
}

export default memo(CellSpeedtestWidget)
