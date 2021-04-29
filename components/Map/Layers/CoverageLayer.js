import { useMemo, memo } from 'react'
import { GeoJSONLayer } from 'react-mapbox-gl'
import { useBlockHeight } from '../../../data/blocks'

const CoverageLayer = ({
  coverageUrl,
  minZoom,
  maxZoom,
  onHotspotClick,
  layer,
}) => {
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
    <GeoJSONLayer
      id="hotspots"
      data={coverageUrl}
      circlePaint={onlineCircleLayout}
      circleOnClick={onHotspotClick}
    />
  )
}

const defaultStyle = (minZoom, maxZoom) => ({
  'circle-color': [
    'match',
    ['get', 'status'],
    'online',
    '#29d391',
    'offline',
    '#e86161',
    /* other */ '#ccc',
  ],
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
    ['match', ['get', 'status'], 'online', 0.2, 'offline', 0, 0],
    maxZoom,
    ['match', ['get', 'status'], 'online', 1, 'offline', 0, 0],
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

export default memo(CoverageLayer)
