import { useEffect, useState, useCallback, useRef, useMemo, memo } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactMapboxGl from 'react-mapbox-gl'
import { setRTLTextPlugin } from 'mapbox-gl'
import { useAsync } from 'react-async-hook'
import { findBounds, paddingPoints } from '../../utils/location'
import HotspotDetailLayer from './Layers/HotspotDetailLayer'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import useMapLayer from '../../hooks/useMapLayer'
import useInfoBox from '../../hooks/useInfoBox'
import useGeolocation from '../../hooks/useGeolocation'
import ValidatorsLayer from './Layers/ValidatorsLayer'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { fetchHotspot } from '../../data/hotspots'
import HexCoverageLayer from './Layers/HexCoverageLayer'
import { hotspotToRes8 } from '../Hotspots/utils'
import useSelectedHex from '../../hooks/useSelectedHex'
import { trackEvent } from '../../hooks/useGA'
import ScaleLegend from './ScaleLegend'
import ZoomControls from './ZoomControls'
import MapControls from './MapControls'
import useMeasuringTool from '../../hooks/useMeasuringTool'
import MeasuringPointsLayer from './Layers/MeasuringPointsLayer'
import { useRouteMatch } from 'react-router-dom'

const maxZoom = 14
const minZoom = 2

setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true,
)

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: true,
  touchZoomRotate: true,
  minZoom: minZoom,
})

const US_BOUNDS = [
  [-61.08, 44.84],
  [-125, 33],
]

const US_EU_BOUNDS = [
  [32.1, 58.63],
  [-125, 33],
]

// const EU_CN_BOUNDS = [
//   [143.61, 62.2],
//   [-14.10009, 23.898041],
// ]

const MOBILE_PADDING = { top: 80, left: 10, right: 10, bottom: 400 }
const MOBILE_PADDING_FULL = { top: 80, left: 10, right: 10, bottom: 80 }
const DESKTOP_PADDING = { top: 200, left: 600, right: 200, bottom: 200 }

const HIDE_TILES = process.env.NEXT_PUBLIC_HIDE_TILES === 'true'

const CoverageMap = () => {
  const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 768 })
  const map = useRef()
  const [styleLoaded, setStyledLoaded] = useState(false)
  const [selectedTxnHotspot, setSelectedTxnHotspot] = useState()
  const [selectedTxnParticipants, setSelectedTxnParticipants] = useState([])

  const { showInfoBox } = useInfoBox()
  const { mapLayer } = useMapLayer()
  const { selectedHotspot } = useSelectedHotspot()
  const { selectHex, selectedHex } = useSelectedHex()
  const { selectedTxn } = useSelectedTxn()
  const { currentPosition } = useGeolocation()
  const {
    measuring,
    measurementStart,
    measurementEnd,
    setStartPoint,
    setEndPoint,
    clearPoints,
  } = useMeasuringTool()

  const [bounds, setBounds] = useState(
    isDesktopOrLaptop ? US_EU_BOUNDS : US_BOUNDS,
  )

  const validatorsMatch = useRouteMatch('/validators')

  useEffect(() => {
    trackEvent('map_load')
  }, [])

  useEffect(() => {
    if (!currentPosition.coords) return
    setBounds(
      findBounds([
        {
          lng: currentPosition.coords.longitude,
          lat: currentPosition.coords.latitude,
        },
        ...paddingPoints({
          lng: currentPosition.coords.longitude,
          lat: currentPosition.coords.latitude,
        }),
      ]),
    )
  }, [currentPosition.coords, currentPosition.timestamp])

  useEffect(() => {
    if (
      !selectedHotspot ||
      !selectedHotspot.lat ||
      !selectedHotspot.lng ||
      !selectedHotspot.location
    ) {
      return
    }

    const selectionBounds = findBounds([
      ...(selectedHotspot.witnesses || []).map(({ lat, lng }) => ({
        lat,
        lng,
      })),
      { lat: selectedHotspot.lat, lng: selectedHotspot.lng },
      ...paddingPoints({ lat: selectedHotspot.lat, lng: selectedHotspot.lng }),
    ])
    setBounds(selectionBounds)
  }, [selectedHotspot])

  useEffect(() => {
    if (!selectedHex) return

    const [lat, lng] = selectedHex.center
    const selectionBounds = findBounds([
      { lat, lng },
      ...paddingPoints({ lat, lng }),
    ])
    setBounds(selectionBounds)
  }, [selectedHex])

  useEffect(() => {
    if (!selectedTxnHotspot || !selectedTxnParticipants) return

    const selectionBounds = findBounds([
      ...(selectedTxnParticipants || []).map(({ lat, lng }) => ({
        lat,
        lng,
      })),
      { lat: selectedTxnHotspot.lat, lng: selectedTxnHotspot.lng },
      ...paddingPoints({
        lat: selectedTxnHotspot.lat,
        lng: selectedTxnHotspot.lng,
      }),
    ])
    setBounds(selectionBounds)
  }, [selectedTxnHotspot, selectedTxnParticipants])

  useAsync(async () => {
    if (selectedTxn && selectedHex) {
      setSelectedTxnHotspot(undefined)
      setSelectedTxnParticipants([])
      return
    }
    if (selectedTxn?.type === 'poc_receipts_v1') {
      const target = selectedTxn.path[0].challengee
      const targetHotspot = await fetchHotspot(target)
      const witnesses = selectedTxn.path[0].witnesses.map(hotspotToRes8)

      setSelectedTxnParticipants(witnesses)
      setSelectedTxnHotspot(targetHotspot)
    } else if (
      selectedTxn?.type === 'assert_location_v1' ||
      selectedTxn?.type === 'assert_location_v2'
    ) {
      const target = selectedTxn.gateway
      const targetHotspot = await fetchHotspot(target)
      setSelectedTxnHotspot(targetHotspot)
      setSelectedTxnParticipants([])
    } else {
      setSelectedTxnHotspot(undefined)
      setSelectedTxnParticipants([])
    }
  }, [selectedTxn, selectedHotspot, selectedHex])

  const fitBoundsOptions = useMemo(() => {
    const animate = styleLoaded
    if (isDesktopOrLaptop) return { padding: DESKTOP_PADDING, animate }
    if (showInfoBox) return { padding: MOBILE_PADDING, animate }
    return { padding: MOBILE_PADDING_FULL, animate }
  }, [isDesktopOrLaptop, showInfoBox, styleLoaded])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setBounds(EU_CN_BOUNDS)
  //   }, 5000)
  // }, [])

  const handleHexClick = useCallback(
    (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['hexes'],
      })
      if (features.length > 0 && !measuring) {
        const [hexFeature] = features
        selectHex(hexFeature.properties.hex)
      }
    },
    [selectHex, measuring],
  )

  const handleMouseMove = useCallback(
    (map, e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['hexes'],
      })
      if (measuring) {
        map.getCanvas().style.cursor = 'crosshair'
      } else if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer'
      } else {
        map.getCanvas().style.cursor = ''
      }
    },
    [measuring],
  )

  const handleMouseMoveRef = useRef(handleMouseMove)
  handleMouseMoveRef.current = handleMouseMove

  const handleClick = useCallback(
    (_, e) => {
      if (!measuring) return

      const coordinates = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      }

      if (!measurementStart && !measurementEnd) {
        setStartPoint(coordinates)
      } else if (measurementStart && !measurementEnd) {
        setEndPoint(coordinates)
      } else {
        clearPoints()
      }
    },
    [
      clearPoints,
      measurementStart,
      measurementEnd,
      measuring,
      setStartPoint,
      setEndPoint,
    ],
  )

  const handleClickRef = useRef(handleClick)
  handleClickRef.current = handleClick

  return (
    <Mapbox
      // eslint-disable-next-line react/style-prop-object
      style="mapbox://styles/petermain/cko1ewc0p0st918lecxa5c8go"
      className="h-full w-screen overflow-hidden"
      fitBounds={bounds}
      fitBoundsOptions={fitBoundsOptions}
      onStyleLoad={(mapInstance) => {
        map.current = mapInstance
        setStyledLoaded(true)
      }}
      // temp fix, there's a bug with react-mapbox-gl where onClick doesn't update the function on state changes:
      // https://github.com/alex3165/react-mapbox-gl/issues/963
      // TODO: once the above issue is fixed, replace the below 2 lines with direct functions instead of refs
      onMouseMove={(map, event) => handleMouseMoveRef.current(map, event)}
      onClick={(map, event) => handleClickRef.current(map, event)}
    >
      <MapControls />
      <ZoomControls />
      <ScaleLegend />
      {!HIDE_TILES && (
        <HexCoverageLayer
          minZoom={minZoom}
          maxZoom={maxZoom}
          onHexClick={handleHexClick}
          layer={mapLayer}
        />
      )}
      <HotspotDetailLayer
        hotspot={selectedTxnHotspot || selectedHotspot}
        witnesses={
          selectedHotspot && selectedTxn
            ? selectedTxnParticipants
            : selectedHotspot?.witnesses || selectedTxnParticipants || []
        }
      />
      {validatorsMatch && (
        <ValidatorsLayer minZoom={minZoom} maxZoom={maxZoom} />
      )}
      <MeasuringPointsLayer
        active={measuring}
        from={measurementStart}
        to={measurementEnd}
      />
    </Mapbox>
  )
}

export default memo(CoverageMap)
