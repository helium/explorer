import { useMemo, memo } from 'react'
import { Source, Layer } from 'react-mapbox-gl'
import { useBlockHeight } from '../../../data/blocks'

const HEX_SOURCE_OPTIONS = {
  type: 'vector',
  url: 'https://hotspot-tileserver-martin.herokuapp.com/public.h3_res8.json',
}

const POINTS_SOURCE_OPTIONS = {
  type: 'vector',
  url: 'https://hotspot-tileserver-martin.herokuapp.com/public.points.json',
}

const HexCoverageLayer = ({ minZoom, maxZoom, onHexClick, layer }) => {
  const { height } = useBlockHeight()

  const onlineCircleLayout = useMemo(() => {
    switch (layer) {
      case 'offline':
        return offlineStyle(minZoom, maxZoom)

      case 'owner':
        return ownerStyle(minZoom, maxZoom)

      case 'rewardScale':
        return rewardScaleStyle(minZoom, maxZoom)

      case 'added':
        if (!height) return defaultStyle(minZoom, maxZoom)
        return addedStyle(minZoom, maxZoom, height)

      default:
        return defaultStyle(minZoom, maxZoom)
    }
  }, [minZoom, maxZoom, layer, height])

  return (
    <>
      <Source id="hexes_source" tileJsonSource={HEX_SOURCE_OPTIONS} />
      <Layer
        sourceLayer="public.h3_res8"
        sourceId="hexes_source"
        id="public.h3_res8"
        type="fill"
        paint={{
          // 'fill-color': '#faf409',
          'fill-color': '#29d391',
          'fill-outline-color': '#1C1E3B',
          'fill-opacity': 0.5,
        }}
        onClick={onHexClick}
      />
      <Source id="points_source" tileJsonSource={POINTS_SOURCE_OPTIONS} />
      <Layer
        sourceLayer="public.points"
        sourceId="points_source"
        id="public.points"
        type="circle"
        paint={onlineCircleLayout}
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

const offlineStyle = (minZoom, maxZoom) => ({
  ...defaultStyle(minZoom, maxZoom),
  'circle-opacity': [
    'interpolate',
    ['exponential', 1.75],
    ['zoom'],
    minZoom,
    0.7,
    maxZoom,
    1,
  ],
})

const ownerStyle = (minZoom, maxZoom) => ({
  ...defaultStyle(minZoom, maxZoom),
  'circle-color': ['get', 'ownerColor'],
})

const rewardScaleStyle = (minZoom, maxZoom) => ({
  ...defaultStyle(minZoom, maxZoom),
  'circle-color': [
    'interpolate',
    ['linear'],
    ['get', 'rewardScale'],
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
})

const addedStyle = (minZoom, maxZoom, height) => {
  return {
    ...defaultStyle(minZoom, maxZoom),
    'circle-color': [
      'case',
      ['==', ['get', 'blockAdded'], 1],
      '#B377F8',
      ['>=', ['get', 'blockAdded'], height - 10000],
      '#474DFF',
      [
        'interpolate',
        ['linear'],
        ['get', 'blockAdded'],
        1,
        '#FF6666',
        height / 5,
        '#FC8745',
        (height / 5) * 2,
        '#FEA053',
        (height / 5) * 3,
        '#FCC945',
        (height / 5) * 4,
        '#9FE14A',
        height,
        '#29D344',
      ],
    ],
  }
}

export default memo(HexCoverageLayer)
