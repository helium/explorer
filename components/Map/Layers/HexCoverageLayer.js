import { useMemo, memo } from 'react'
import { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl'
import useSelectedHex from '../../../hooks/useSelectedHex'
import { emptyGeoJSON } from '../../../utils/location'

const HOTSPOT_COLOR = '#29d391'
const DATA_COLOR = '#58a7f9'
const DC_THRESHOLD = 100

const TILESERVER_URL =
  process.env.NEXT_PUBLIC_TILESERVER_URL ||
  'https://hotspot-tileserver.helium.wtf'

const HEX_SOURCE_OPTIONS = {
  type: 'vector',
  url: `${TILESERVER_URL}/public.h3_res8.json`,
}

const POINTS_SOURCE_OPTIONS = {
  type: 'vector',
  url: `${TILESERVER_URL}/public.points.json`,
}

const HexCoverageLayer = ({ minZoom, maxZoom, onHexClick, layer }) => {
  const { selectedHex } = useSelectedHex()

  const circleLayout = useMemo(() => {
    switch (layer) {
      case 'rewardScale':
        return rewardScaleStyle(minZoom, maxZoom)

      case 'dc':
        return dcStyle(minZoom, maxZoom)

      default:
        return defaultStyle(minZoom, maxZoom)
    }
  }, [layer, minZoom, maxZoom])

  const hexLayout = useMemo(() => {
    switch (layer) {
      case 'rewardScale':
        return hexRewardScaleStyle()

      case 'dc':
        return hexDcStyle()

      default:
        return hexDefaultStyle()
    }
  }, [layer])

  return (
    <>
      <Source id="points_source" tileJsonSource={POINTS_SOURCE_OPTIONS} />
      <Layer
        sourceId="points_source"
        sourceLayer="public.points"
        id="points"
        type="circle"
        paint={circleLayout}
      />
      <Source id="hexes_source" tileJsonSource={HEX_SOURCE_OPTIONS} />
      <Layer
        sourceId="hexes_source"
        sourceLayer="public.h3_res8"
        id="hexes"
        type="fill"
        paint={hexLayout}
        onClick={onHexClick}
      />
      <Layer
        sourceId="hexes_source"
        sourceLayer="public.h3_res8"
        id="hexes_line"
        type="line"
        paint={hexOutlineStyle}
      />
      <Layer
        sourceId="points_source"
        sourceLayer="public.points"
        id="labels"
        type="symbol"
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

const defaultStyle = (minZoom, maxZoom) => ({
  'circle-color': HOTSPOT_COLOR,
  'circle-radius': {
    stops: [
      [minZoom, 2],
      [maxZoom, 5],
    ],
  },
  'circle-opacity': [
    'interpolate',
    ['exponential', 1],
    ['zoom'],
    minZoom,
    0.2,
    maxZoom,
    0,
  ],
})

const rewardScaleStyle = (minZoom, maxZoom) => ({
  ...defaultStyle(minZoom, maxZoom),
  'circle-color': [
    'case',
    ['==', ['get', 'avg_earnings'], 0],
    '#4F5293',
    [
      'interpolate',
      ['linear'],
      ['get', 'avg_earnings'],
      0,
      '#FF6666',
      0.2,
      '#FC8745',
      0.4,
      '#FEA053',
      0.6,
      '#FCC945',
      0.8,
      '#9FE14A',
      1,
      '#29D344',
    ],
  ],
})

const dcStyle = (minZoom, maxZoom) => ({
  ...defaultStyle(minZoom, maxZoom),
  'circle-color': DATA_COLOR,
  'circle-opacity': [
    'interpolate',
    ['exponential', 1],
    ['zoom'],
    minZoom,
    ['*', 0.2, ['/', ['get', 'dc'], DC_THRESHOLD]],
    maxZoom,
    0,
  ],
})

const hexDefaultStyle = () => ({
  'fill-color': HOTSPOT_COLOR,
  'fill-opacity': 0.5,
})

const hexOutlineStyle = {
  'line-color': '#2f3a59',
  'line-width': ['interpolate', ['exponential', 1], ['zoom'], 6.5, 0, 12, 4],
  'line-blur': 4,
  'line-opacity': 1,
}

const hexRewardScaleStyle = (minZoom, maxZoom) => ({
  ...hexDefaultStyle(minZoom, maxZoom),
  'fill-color': [
    'case',
    ['==', ['get', 'avg_earnings'], 0],
    '#4F5293',
    [
      'interpolate',
      ['linear'],
      ['get', 'avg_earnings'],
      0,
      '#FF6666',
      0.2,
      '#FC8745',
      0.4,
      '#FEA053',
      0.6,
      '#FCC945',
      0.8,
      '#9FE14A',
      1,
      '#29D344',
    ],
  ],
})

const hexDcStyle = () => ({
  ...hexDefaultStyle(),
  'fill-color': DATA_COLOR,
  'fill-opacity': [
    'interpolate',
    ['linear'],
    ['get', 'dc'],
    0,
    0,
    1,
    0.5,
    DC_THRESHOLD,
    0.8,
  ],
})

export default memo(HexCoverageLayer)
