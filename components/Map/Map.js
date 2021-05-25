import { useEffect, useState, useCallback, useRef, useMemo, memo } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactMapboxGl from 'react-mapbox-gl'
import { h3ToGeo } from 'h3-js'
import { useAsync } from 'react-async-hook'
import useSWR from 'swr'
import { useHistory } from 'react-router'
import { findBounds } from '../../utils/location'
import HotspotDetailLayer from './Layers/HotspotDetailLayer'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import useMapLayer from '../../hooks/useMapLayer'
import useInfoBox from '../../hooks/useInfoBox'
import useGeolocation from '../../hooks/useGeolocation'
import ValidatorsLayer from './Layers/ValidatorsLayer'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import { fetchConsensusHotspots, fetchHotspot } from '../../data/hotspots'
import HexCoverageLayer from './Layers/HexCoverageLayer'
import { hotspotToRes8 } from '../Hotspots/utils'

const maxZoom = 14
const minZoom = 2

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: true,
  touchZoomRotate: true,
  maxZoom: maxZoom,
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

const EU_CN_BOUNDS = [
  [143.61, 62.2],
  [-14.10009, 23.898041],
]

const MOBILE_PADDING = { top: 10, left: 10, right: 10, bottom: 450 }
const DESKTOP_PADDING = { top: 200, left: 600, right: 200, bottom: 200 }

const CoverageMap = () => {
  const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 768 })
  const map = useRef()
  const [styleLoaded, setStyledLoaded] = useState(false)
  const [selectedTxnHotspot, setSelectedTxnHotspot] = useState()
  const [selectedTxnParticipants, setSelectedTxnParticipants] = useState([])

  const { showInfoBox } = useInfoBox()
  const { mapLayer } = useMapLayer()
  const { selectHotspot, selectedHotspot } = useSelectedHotspot()
  const { selectedTxn } = useSelectedTxn()
  const { currentPosition } = useGeolocation()
  const history = useHistory()

  const [bounds, setBounds] = useState(
    isDesktopOrLaptop ? US_EU_BOUNDS : US_BOUNDS,
  )

  const { data: validators } = useSWR('/api/validators')

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
    if (!selectedHotspot || !selectedHotspot.lat || !selectedHotspot.lng) {
      return
    }

    const selectionBounds = findBounds([
      ...(selectedHotspot.witnesses || []).map(({ lat, lng }) => ({
        lat,
        lng,
      })),
      { lat: selectedHotspot.lat, lng: selectedHotspot.lng },
    ])
    setBounds(selectionBounds)
  }, [selectedHotspot])

  useEffect(() => {
    if (!selectedTxnHotspot || !selectedTxnParticipants) return

    const selectionBounds = findBounds([
      ...(selectedTxnParticipants || []).map(({ lat, lng }) => ({
        lat,
        lng,
      })),
      { lat: selectedTxnHotspot.lat, lng: selectedTxnHotspot.lng },
    ])
    setBounds(selectionBounds)
  }, [selectedTxnHotspot, selectedTxnParticipants])

  useAsync(async () => {
    if (selectedTxn?.type === 'poc_receipts_v1') {
      const target = selectedTxn.path[0].challengee
      const targetHotspot = await fetchHotspot(target)
      const witnesses = selectedTxn.path[0].witnesses.map(hotspotToRes8)

      setSelectedTxnHotspot(targetHotspot)
      setSelectedTxnParticipants(witnesses)
      return
    } else if (
      selectedTxn?.type === 'assert_location_v1' ||
      selectedTxn?.type === 'assert_location_v2'
    ) {
      const target = selectedTxn.gateway
      const targetHotspot = await fetchHotspot(target)
      setSelectedTxnHotspot(targetHotspot)
      setSelectedTxnParticipants([])
      return
    } else if (selectedTxn?.type === 'consensus_group_v1') {
      const members = await fetchConsensusHotspots(txn.height)
      setSelectedTxnHotspot(undefined)
      setSelectedTxnParticipants(members)
      return
    } else {
      setSelectedTxnHotspot(undefined)
      setSelectedTxnParticipants([])
      return
    }
  }, [selectedTxn])

  const fitBoundsOptions = useMemo(() => {
    const animate = styleLoaded
    if (isDesktopOrLaptop) return { padding: DESKTOP_PADDING, animate }
    if (showInfoBox) return { padding: MOBILE_PADDING, animate }
    return { padding: 10, animate }
  }, [isDesktopOrLaptop, showInfoBox, styleLoaded])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setBounds(EU_CN_BOUNDS)
  //   }, 5000)
  // }, [])

  const handleHexClick = useCallback(
    (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['public.h3_res8'],
      })
      if (features.length > 0) {
        const [hexFeature] = features
        history.push(`/hotspots/hex/${hexFeature.properties.id}`)
      }
    },
    [history],
  )

  const handleMouseMove = useCallback((map, e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['public.h3_res8'],
    })
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer'
    } else {
      map.getCanvas().style.cursor = ''
    }
  }, [])

  return (
    <Mapbox
      style="mapbox://styles/petermain/cko1ewc0p0st918lecxa5c8go"
      className="h-full w-screen overflow-hidden"
      fitBounds={bounds}
      fitBoundsOptions={fitBoundsOptions}
      onStyleLoad={(mapInstance) => {
        map.current = mapInstance
        setStyledLoaded(true)
      }}
      onMouseMove={handleMouseMove}
    >
      <HexCoverageLayer
        minZoom={minZoom}
        maxZoom={maxZoom}
        onHexClick={handleHexClick}
        layer={mapLayer}
      />
      <HotspotDetailLayer
        hotspot={selectedHotspot || selectedTxnHotspot}
        witnesses={selectedHotspot?.witnesses || selectedTxnParticipants || []}
        members={
          selectedTxn?.type === 'consensus_group_v1'
            ? selectedTxnParticipants
            : []
        }
      />
      <ValidatorsLayer
        validators={validators}
        minZoom={minZoom}
        maxZoom={maxZoom}
      />
    </Mapbox>
  )
}

export default memo(CoverageMap)
