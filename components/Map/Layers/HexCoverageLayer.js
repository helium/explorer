import { useMemo, memo } from 'react'
import { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl'
import useSelectedHex from '../../../hooks/useSelectedHex'
import { emptyGeoJSON } from '../../../utils/location'

const HEX_SOURCE_OPTIONS = {
  type: 'vector',
  url: 'https://hotspot-tileserver-martin.herokuapp.com/public.h3_res8.json',
}

const POINTS_SOURCE_OPTIONS = {
  type: 'vector',
  url: 'https://hotspot-tileserver-martin.herokuapp.com/public.points.json',
}

const HexCoverageLayer = ({ minZoom, maxZoom, onHexClick, layer }) => {
  const { selectedHex } = useSelectedHex()

  const circleLayout = useMemo(() => {
    switch (layer) {
      case 'rewardScale':
        return rewardScaleStyle(minZoom, maxZoom)

      default:
        return defaultStyle(minZoom, maxZoom)
    }
  }, [minZoom, maxZoom, layer])

  const hexLayout = useMemo(() => {
    switch (layer) {
      case 'rewardScale':
        return hexRewardScaleStyle()

      default:
        return hexDefaultStyle()
    }
  }, [layer])

  return (
    <>
      <Source id="hexes_source" tileJsonSource={HEX_SOURCE_OPTIONS} />
      <Layer
        sourceLayer="public.h3_res8"
        sourceId="hexes_source"
        id="public.h3_res8"
        type="fill"
        paint={hexLayout}
        onClick={onHexClick}
      />
      <Source id="points_source" tileJsonSource={POINTS_SOURCE_OPTIONS} />
      <Layer
        sourceLayer="public.points"
        sourceId="points_source"
        id="public.points"
        type="circle"
        paint={circleLayout}
      />
      <Layer
        id="hex_label"
        sourceLayer="public.points"
        sourceId="points_source"
        type="symbol"
        minZoom={11}
        layout={{
          'text-field': ['get', 'hotspot_count'],
          'text-allow-overlap': false,
         'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 18,
        }}
        paint={{
          'text-opacity': ['case', ['==', ['get', 'hotspot_count'], 1], 0, 0.85],
          'text-color': [
            'case',
            ['==', ['get', 'id'], selectedHex?.index],
            '#ffffff',
            '#1C1E3B',
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
  'circle-color': '#29d391',
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
    ['==', ['get', 'avg_reward_scale'], 0],
    '#4F5293',
    [
      'interpolate',
      ['linear'],
      ['get', 'avg_reward_scale'],
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

const hexDefaultStyle = () => ({
  'fill-color': '#29d391',
  'fill-outline-color': '#1C1E3B',
  'fill-opacity': 0.5,
})

const hexRewardScaleStyle = () => ({
  ...hexDefaultStyle(),
  'fill-color': [
    'case',
    ['==', ['get', 'avg_reward_scale'], 0],
    '#4F5293',
    [
      'interpolate',
      ['linear'],
      ['get', 'avg_reward_scale'],
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

export default memo(HexCoverageLayer)
