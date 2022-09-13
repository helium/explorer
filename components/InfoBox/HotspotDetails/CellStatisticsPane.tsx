import { memo } from 'react'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import useApi from '../../../hooks/useApi'
import CellStatusWidget from '../../Widgets/CellStatusWidget'
import { Hotspot } from '@helium/http'
import { SWRResponse } from 'swr'
import CellSpeedtestWidget from '../../Widgets/CellSpeedtestWidget'

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

export type CellSpeedtest = {
  downloadSpeed: number
  hotspotAddress: string
  latency: number
  timestamp: number
  uploadSpeed: number
}

type Props = {
  hotspot: Hotspot
}

const CellStatisticsPane = ({ hotspot }: Props) => {
  const { data: cellHotspot }: SWRResponse<CellHotspot> = useApi(
    `/cell/hotspots/${hotspot.address}`,
  )

  const { data: cellSpeedtest }: SWRResponse<CellSpeedtest> = useApi(
    `/cell/hotspots/${hotspot.address}/latest-speedtest`,
  )

  return (
    <InfoBoxPaneContainer>
      <CellStatusWidget cellHotspot={cellHotspot} />
      <CellSpeedtestWidget cellSpeedtest={cellSpeedtest} />
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

export default memo(CellStatisticsPane)
