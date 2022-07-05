import { memo, useMemo } from 'react'
import { GeoJSONLayer, Layer, Source } from 'react-mapbox-gl'
import { emptyGeoJSON } from '../../../utils/location'
import useSelectedHex from '../../../hooks/useSelectedHex'
import {
  defaultStyle,
  hexDefaultStyle,
  hexOutlineStyle,
  TILESERVER_URL,
} from './HexCoverageLayer'

const CELL_HOTSPOT_COLOR = '#D23E72'

const CELL_HEX_SOURCE_OPTIONS = {
  type: 'vector',
  url: `${TILESERVER_URL}/public.cell_h3_res8.json`,
}

const CELL_POINTS_SOURCE_OPTIONS = {
  type: 'vector',
  url: `${TILESERVER_URL}/public.cell_points.json`,
}

const CbrsLayer = ({ minZoom, maxZoom, onClick }) => {
  const { selectedHex } = useSelectedHex()

  const circleLayout = useMemo(() => cellCircleStyle(minZoom, maxZoom),
    [minZoom, maxZoom])

  const hexLayout = useMemo(() => cellHexStyle(), [])

  return (
    <>
      <Source id='cell_points_source' tileJsonSource={CELL_POINTS_SOURCE_OPTIONS} />
      <Layer
        sourceId='cell_points_source'
        sourceLayer='public.cell_points'
        id='cell_points'
        type='circle'
        paint={circleLayout}
      />
      <Source id='cell_hexes_source' tileJsonSource={CELL_HEX_SOURCE_OPTIONS} />
      <Layer
        sourceId='cell_hexes_source'
        sourceLayer='public.cell_h3_res8'
        id='cell_hexes'
        type='fill'
        paint={hexLayout}
        onClick={onClick}
      />
      <Layer
        sourceId='cell_hexes_source'
        sourceLayer='public.cell_h3_res8'
        id='cell_hexes_line'
        type='line'
        paint={hexOutlineStyle}
      />
      <Layer
        sourceId='cell_points_source'
        sourceLayer='public.cell_points'
        id='cell_labels'
        type='symbol'
        minZoom={11}
        layout={{
          'text-field': ['get', 'hotspot_count'],
          'text-allow-overlap': false,
          'text-font': ['Inter Semi Bold', 'Arial Unicode MS Bold'],
          'text-size': 23,
        }}
        paint={{
          'text-opacity': [
            'case',
            ['==', ['get', 'hotspot_count'], 1],
            0,
            0.85,
          ],
          'text-color': [
            'case',
            [
              '==',
              ['get', 'id'],
              selectedHex?.index ? selectedHex.index : null,
            ],
            '#ffffff',
            '#10192d',
          ],
        }}
      />
      <GeoJSONLayer
        data={selectedHex?.feature || emptyGeoJSON}
        linePaint={{
          'line-color': '#ffffff',
          'line-width': 4,
        }}
      />
    </>
  )
}

const cellCircleStyle = (minZoom, maxZoom) => ({
  ...defaultStyle(minZoom, maxZoom),
  'circle-color': CELL_HOTSPOT_COLOR,
})

const cellHexStyle = (minZoom, maxZoom) => ({
  ...hexDefaultStyle(minZoom, maxZoom),
  'fill-color': CELL_HOTSPOT_COLOR,
})

export default memo(CbrsLayer)
