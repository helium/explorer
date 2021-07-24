import { useMemo, memo } from 'react'
import { Source, Layer, GeoJSONLayer } from 'react-mapbox-gl'
import GeoJSON from 'geojson'
import { h3ToGeo } from 'h3-js'
import { h3SetToFeatureCollection } from 'geojson2h3'
import useApi from '../../../hooks/useApi'
import useSelectedHex from '../../../hooks/useSelectedHex'
import { emptyGeoJSON } from '../../../utils/location'
import { keyBy } from 'lodash'

const HexCoverageLayer = ({ minZoom, maxZoom, onHexClick, layer }) => {
  const { selectedHex } = useSelectedHex()
  const { data: hexes } = useApi('/hexes', { dedupingInterval: 1000 * 60 })

  const pointsSource = useMemo(() => {
    if (!hexes) return emptyGeoJSON

    const points = hexes.map((h) => {
      const [lat, lng] = h3ToGeo(h.hex)
      return { ...h, lat, lng }
    })

    return GeoJSON.parse(points, { Point: ['lat', 'lng'] })
  }, [hexes])

  const hexesSource = useMemo(() => {
    if (!hexes) return emptyGeoJSON
    const hexLookup = keyBy(hexes, 'hex')
    return h3SetToFeatureCollection(
      Object.keys(hexLookup),
      (h3Index) => hexLookup[h3Index],
    )
  }, [hexes])

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
      <Source
        id="points"
        geoJsonSource={{ type: 'geojson', data: pointsSource }}
      />
      <Layer sourceId="points" id="points" type="circle" paint={circleLayout} />
      <Source
        id="hexes"
        geoJsonSource={{ type: 'geojson', data: hexesSource }}
      />
      <Layer
        sourceId="hexes"
        id="hexes"
        type="fill"
        paint={hexLayout}
        onClick={onHexClick}
      />
      <Layer
        sourceId="hexes"
        id="hexes_line"
        type="line"
        paint={hexOutlineStyle}
      />
      <Layer
        sourceId="points"
        id="labels"
        type="symbol"
        minZoom={11}
        layout={{
          'text-field': ['get', 'count'],
          'text-allow-overlap': false,
          'text-font': ['Inter Semi Bold', 'Arial Unicode MS Bold'],
          'text-size': 23,
        }}
        paint={{
          'text-opacity': ['case', ['==', ['get', 'count'], 1], 0, 0.85],
          'text-color': [
            'case',
            ['==', ['get', 'hex'], selectedHex?.index],
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
    ['==', ['get', 'scale'], 0],
    '#4F5293',
    [
      'interpolate',
      ['linear'],
      ['get', 'scale'],
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
  'fill-opacity': 0.5,
})

const hexOutlineStyle = {
  'line-color': '#2a3654',
  'line-width': ['interpolate', ['exponential', 1], ['zoom'], 6.5, 0.1, 12, 4],
  'line-blur': 4,
  'line-opacity': 0.75,
}

const hexRewardScaleStyle = () => ({
  ...hexDefaultStyle(),
  'fill-color': [
    'case',
    ['==', ['get', 'scale'], 0],
    '#4F5293',
    [
      'interpolate',
      ['linear'],
      ['get', 'scale'],
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
