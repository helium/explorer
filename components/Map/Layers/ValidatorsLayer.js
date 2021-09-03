import { useMemo, memo } from 'react'
import { GeoJSONLayer } from 'react-mapbox-gl'
import geoJSON from 'geojson'
import { emptyGeoJSON } from '../../../utils/location'
import { useRouteMatch } from 'react-router-dom'
import useApi from '../../../hooks/useApi'

const ValidatorsLayer = ({ minZoom, maxZoom, onValidatorClick }) => {
  const { data: validators } = useApi('/validators')
  const validatorsMatch = useRouteMatch('/validators')
  const consensusMatch = useRouteMatch('/validators/consensus')

  const validatorsGeo = useMemo(() => {
    if (!validators) return emptyGeoJSON

    const validatorsWithLocation = validators
      .filter((v) => v?.geo?.latitude && v?.geo?.longitude)
      .map((v) => ({
        address: v.address,
        lat: v.geo.latitude,
        lng: v.geo.longitude,
        elected: v.elected,
      }))

    return geoJSON.parse(validatorsWithLocation, {
      Point: ['lat', 'lng'],
      include: ['address', 'elected'],
    })
  }, [validators])

  const onlineCircleLayout = useMemo(() => {
    if (!validatorsMatch) {
      return {
        ...defaultStyle(minZoom, maxZoom),
        'circle-opacity': 0,
      }
    }

    if (consensusMatch) {
      return {
        ...defaultStyle(minZoom, maxZoom),
        'circle-opacity': ['case', ['get', 'elected'], 1, 0],
        'circle-stroke-width': ['case', ['get', 'elected'], 2, 0],
        'circle-stroke-color': '#fff',
        'circle-radius': {
          stops: [
            [minZoom, 8],
            [maxZoom, 10],
          ],
        },
      }
    }

    return defaultStyle(minZoom, maxZoom)
  }, [consensusMatch, maxZoom, minZoom, validatorsMatch])

  return (
    <GeoJSONLayer
      id="validators"
      data={validatorsGeo}
      circlePaint={onlineCircleLayout}
      circleOnClick={onValidatorClick}
    />
  )
}

const defaultStyle = (minZoom, maxZoom) => ({
  'circle-color': '#B377F8',
  'circle-radius': {
    stops: [
      [minZoom, 4],
      [maxZoom, 8],
    ],
  },
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

export default memo(ValidatorsLayer)
