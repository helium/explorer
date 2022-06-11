import React, { memo } from 'React'
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
  const { data: heartbeat } : SWRResponse<CellHeartbeat> =
    useApi(`/cell/heartbeats/hotspots/${hotspot.address}/last`)

  return (
    <InfoBoxPaneContainer>
      {heartbeat !== undefined ? (
        <>
          <CellStatusWidget hotspot={hotspot} heartbeat={heartbeat} />
          {/*@ts-ignore*/}
          <Widget
            title='CBSD Category'
            value={heartbeat?.cbsdCategory}
          />
          {/*@ts-ignore*/}
          <Widget
            title='Hotspot Type'
            value={heartbeat?.hotspotType}
          />
        </>
      ) : (
        <div className="col-span-2">
          Data Not Currently Available
        </div>
      )}
    </InfoBoxPaneContainer>
  )
}

export default memo(CellStatisticsPane)
