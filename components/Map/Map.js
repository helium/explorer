import { useEffect, useState, useCallback, useRef, useMemo, memo } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactMapboxGl from 'react-mapbox-gl'
import fetch from 'node-fetch'
import { useAsync } from 'react-async-hooks'
import { findBounds } from '../../utils/location'
import CoverageLayer from './Layers/CoverageLayer'
import HotspotDetailLayer from './Layers/HotspotDetailLayer'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import useMapLayer from '../../hooks/useMapLayer'
import useInfoBox from '../../hooks/useInfoBox'
import useGeolocation from '../../hooks/useGeolocation'

const maxZoom = 14
const minZoom = 2

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: true,
  touchZoomRotate: true,
  maxZoom: maxZoom,
  minZoom: minZoom,
})

const initialPosition = { timestamp: 0 }

const US_BOUNDS = [
  [-61.08, 44.84],
  [-125, 33],
]

const US_EU_BOUNDS = [
  [32.1, 58.63],
  [-125, 33],
]

const EU_CN_BOUNDS = [
  [143.61, 62.2],
  [-14.10009, 23.898041],
]

const MOBILE_PADDING = { top: 10, left: 10, right: 10, bottom: 450 }
const DESKTOP_PADDING = { top: 10, left: 600, right: 10, bottom: 10 }

const CoverageMap = () => {
  const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 1224 })
  const map = useRef()

  const { showInfoBox } = useInfoBox()
  const { mapLayer } = useMapLayer()
  const { selectHotspot, selectedHotspot } = useSelectedHotspot()
  const { currentPosition } = useGeolocation()

  const [coverage, setCoverage] = useState()
  const [bounds, setBounds] = useState(
    isDesktopOrLaptop ? US_EU_BOUNDS : US_BOUNDS,
  )

  useAsync(async () => {
    const response = await fetch('/api/coverage')
    const coverage = await response.json()
    setCoverage(coverage)
  }, [])

  useEffect(() => {
    if (!currentPosition.coords) return
    setBounds(
      findBounds([
        {
          lng: currentPosition.coords.longitude,
          lat: currentPosition.coords.latitude,
        },
      ]),
    )
  }, [currentPosition.coords, currentPosition.timestamp])

  useEffect(() => {
    if (!selectedHotspot) return

    const selectionBounds = findBounds([
      ...(selectedHotspot.witnesses || []).map(({ lat, lng }) => ({
        lat,
        lng,
      })),
      { lat: selectedHotspot.lat, lng: selectedHotspot.lng },
    ])
    setBounds(selectionBounds)
  }, [selectedHotspot])

  const fitBoundsOptions = useMemo(() => {
    if (isDesktopOrLaptop) return { padding: DESKTOP_PADDING, animate: true }
    if (showInfoBox) return { padding: MOBILE_PADDING, animate: true }
    return { padding: 10, animate: true }
  }, [isDesktopOrLaptop, showInfoBox])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setBounds(EU_CN_BOUNDS)
  //   }, 5000)
  // }, [])

  const handleHotspotClick = useCallback(
    (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['hotspots-circle'],
      })

      if (features.length === 1) {
        // if a single hotspot was clicked on, then select it
        const [feature] = features
        const selectedHotspot = {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          ...feature.properties,
        }
        selectHotspot(selectedHotspot)
      } else {
        // if more than one hotspot was clicked on, adjust bounds to fit that cluster
        const selectionBounds = findBounds(
          features.map(({ geometry: { coordinates } }) => ({
            lat: coordinates[1],
            lng: coordinates[0],
          })),
        )
        setBounds(selectionBounds)
      }

      map.current.getCanvas().style.cursor = ''
    },
    [selectHotspot],
  )

  const handleMouseMove = useCallback((map, e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['hotspots-circle'],
    })
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer'
    } else {
      map.getCanvas().style.cursor = ''
    }
  }, [])

  return (
    <Mapbox
      style="mapbox://styles/petermain/ckmwdn50a1ebk17o3h5e6wwui"
      className="h-full w-screen overflow-hidden"
      fitBounds={bounds}
      fitBoundsOptions={fitBoundsOptions}
      onStyleLoad={(mapInstance) => {
        map.current = mapInstance
      }}
      onMouseMove={handleMouseMove}
    >
      <CoverageLayer
        hotspots={coverage}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onHotspotClick={handleHotspotClick}
        layer={mapLayer}
      />
      <HotspotDetailLayer hotspot={selectedHotspot} />
    </Mapbox>
  )
}

export default memo(CoverageMap)
