import { memo, useMemo } from 'react'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import useApi from '../../../hooks/useApi'
import CellStatusWidget from '../../Widgets/CellStatusWidget'
import { Hotspot } from '@helium/http'
import { SWRResponse } from 'swr'
import Widget from '../../Widgets/Widget'

export type CellHeartbeat = {
  cbsdCategory: string,
  cellId: number
  createdAt: string
  hotspotType: string
  id: string
  lat: number
  lon: number
  operationMode: string
  pubkey: string
  timestamp: string
}

type Props = {
  hotspot: Hotspot
}

const CellStatisticsPane = ({ hotspot }: Props) => {
  const { data: heartbeat }: SWRResponse<CellHeartbeat> =
    useApi(`/cell/heartbeats/hotspots/${hotspot.address}/last`)

  const category = useMemo(() => {
    switch (heartbeat?.cbsdCategory) {
      case 'A':
        return 'Indoor'
      case 'B':
        return 'Outdoor'
      default:
        return 'Unknown'
    }
  }, [heartbeat?.cbsdCategory])

  return (
    <InfoBoxPaneContainer>
      <CellStatusWidget heartbeat={heartbeat} />
      {/*@ts-ignore*/}
      <Widget
        title='Small Cell Location'
        value={category}
      />
    </InfoBoxPaneContainer>
  )
}

export default memo(CellStatisticsPane)
