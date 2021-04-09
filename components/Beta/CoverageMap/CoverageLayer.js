import { useMemo } from 'react'
import { GeoJSONLayer } from 'react-mapbox-gl'
import { emptyGeoJSON } from '../../../utils/location'

const CoverageLayer = ({
  hotspots,
  minZoom,
  maxZoom,
  onHotspotClick,
  layer,
}) => {
  const onlineCircleLayout = useMemo(() => {
    return {
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
      'circle-opacity':
        layer === 'offline'
          ? [
              'interpolate',
              ['exponential', 1.75],
              ['zoom'],
              minZoom,
              0.7,
              maxZoom,
              1,
            ]
          : [
              'interpolate',
              ['exponential', 1.75],
              ['zoom'],
              minZoom,
              ['match', ['get', 'status'], 'online', 0.7, 'offline', 0, 0],
              maxZoom,
              ['match', ['get', 'status'], 'online', 1, 'offline', 0, 0],
            ],
    }
  }, [minZoom, maxZoom, layer])

  return (
    <GeoJSONLayer
      id="hotspots"
      data={hotspots || emptyGeoJSON}
      circlePaint={onlineCircleLayout}
      circleOnClick={onHotspotClick}
    />
  )
}

export default CoverageLayer
