import { memo, useCallback } from 'react'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import useApi from '../../../hooks/useApi'
import CellStatusWidget, { isRadioActive } from '../../Widgets/CellStatusWidget'
import { Hotspot } from '@helium/http'
import { SWRResponse } from 'swr'
import CellSpeedtestWidget from '../../Widgets/CellSpeedtestWidget'
import { sortBy } from 'lodash'

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
  const { data: cellHotspots }: SWRResponse<CellHeartbeat[]> = useApi(
    `/cell/hotspots/${hotspot.address}/cells`,
  )

  const { data: cellSpeedtest }: SWRResponse<CellSpeedtest> = useApi(
    `/cell/hotspots/${hotspot.address}/latest-speedtest`,
  )

  const RadioList = useCallback(() => {
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
  }, [cellHotspots])

  return (
    <InfoBoxPaneContainer>
      <CellSpeedtestWidget cellSpeedtest={cellSpeedtest} />
      <RadioList />
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
