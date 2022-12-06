import { memo } from 'react'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import useApi from '../../../hooks/useApi'
import CellStatusWidget, { isRadioActive } from '../../Widgets/CellStatusWidget'
import { Hotspot } from '@helium/http'
import { SWRResponse } from 'swr'
import CellSpeedtestWidget from '../../Widgets/CellSpeedtestWidget'
import { sortBy } from 'lodash'
import { Skeleton } from 'antd'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'

export type CellHotspot = {
  blockTimestamp: string
  height: number
  lastAttach?: string
  lastHeartbeat?: string
  lastSpeedtest?: string
  owner: string
  payer: string
  pubkey: string
  txnHash: string
}

export type CellHeartbeat = {
  timestamp: number
  cellId: number
  operationMode: boolean
  hotspotAddress: string
  ownerAddress: string
  hotspotType: string
  cbsdCategory: string
  cbsdId: string
}

export enum SpeedTestValidity {
  VALID = 'speedtest_avg_validity_valid',
  TOO_FEW_SAMPLES = 'speedtest_avg_validity_too_few_samples',
  SLOW_DOWNLOAD = 'speedtest_avg_validity_slow_download_speed',
  SLOW_UPLOAD = 'speedtest_avg_validity_slow_upload_speed',
  HIGH_LATENCY = 'speedtest_avg_validity_high_latency',
}

export type CellAvgSpeedtest = {
  downloadSpeedAvgBps: number
  hotspotAddress: string
  latencyAvgMs: number
  rewardMultiplier: number
  timestamp: number
  uploadSpeedAvgBps: number
  validity: SpeedTestValidity
}

type Props = {
  hotspot: Hotspot
}

const CellStatisticsPane = ({ hotspot }: Props) => {
  const { data: cellHotspots }: SWRResponse<CellHeartbeat[]> = useApi(
    `/cell/hotspots/${hotspot.address}/cells`,
  )

  const { data: cellSpeedtest }: SWRResponse<CellAvgSpeedtest> = useApi(
    `/cell/hotspots/${hotspot.address}/avg-speedtest`,
  )

  return (
    <InfoBoxPaneContainer>
      <PeriodizedRewardsWidget
        address={hotspot?.address}
        title="Hotspot Mobile Earnings (UTC)"
        titleTooltip="Earned rewards will appear on the Blockchain in about 30 minutes after the Reward Period ends."
        type="hotspotRadios"
        periods={[
          { number: 7, type: 'day' },
          { number: 14, type: 'day' },
          { number: 30, type: 'day' },
        ]}
      />
      <CellSpeedtestWidget
        cellSpeedtest={cellSpeedtest}
        loading={cellSpeedtest === undefined}
      />
      <RadioList
        cellHotspots={cellHotspots}
        loading={cellHotspots === undefined}
      />
      <a
        href="https://docs.helium.com/5g-on-helium/cbrs-radios"
        target="_blank"
        className="col-span-2"
        rel="noreferrer"
      >
        For more information on Small Cell Radios and status, visit the docs.
      </a>
    </InfoBoxPaneContainer>
  )
}

type RadioListProps = {
  cellHotspots: CellHeartbeat[]
  loading: boolean
}
const RadioList = ({ cellHotspots, loading }: RadioListProps) => {
  if (loading) {
    return (
      <div className="col-span-2 rounded-lg bg-gray-200 p-3">
        <Skeleton />
      </div>
    )
  }

  if (!cellHotspots || !cellHotspots.length) return <CellStatusWidget />

  const sorted = sortBy(
    cellHotspots,
    (radio) => isRadioActive(radio),
    (radio) => {
      const length = radio.cbsdId.length
      return radio.cbsdId.slice(length - 4, length)
    },
  )

  return (
    <>
      {sorted.map((data, index) => (
        <CellStatusWidget cellHotspot={data} key={data.cellId} />
      ))}
    </>
  )
}

export default memo(CellStatisticsPane)
