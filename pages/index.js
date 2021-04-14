import React, { useCallback, useState } from 'react'
import Header from '../components/Beta/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import MetaTags from '../components/AppLayout/MetaTags'
import InfoBox from '../components/Beta/InfoBox'
import useToggle from '../utils/useToggle'
import MapLayersBox from '../components/Beta/MapLayersBox'
import MapControls from '../components/Beta/MapControls'
import { haversineDistance } from '../utils/location'
import { useHotspotsStats } from '../data/hotspots'

const MAX_WITNESS_DISTANCE_THRESHOLD = 200

const Map = dynamic(() => import('../components/Beta/CoverageMap'), {
  ssr: false,
  loading: () => <div />,
})

async function getWitnesses(hotspotid) {
  const witnesses = await fetch(
    `https://api.helium.io/v1/hotspots/${hotspotid}/witnesses`,
  )
    .then((res) => res.json())
    .then((json) => json.data.filter((w) => !(w.address === hotspotid)))
  return witnesses
}

const Coverage = () => {
  const [showInfoBox, toggleShowInfoBox, setShowInfoBox] = useToggle(true)
  const [showMapLayers, toggleShowMapLayers, setShowMapLayers] = useToggle(
    false,
  )
  const [currentPosition, setCurrentPosition] = useState()
  const [loadingCurrentPosition, setLoadingCurrentPosition] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState()
  const [layer, setLayer] = useState(null)
  const { hotspotsStats } = useHotspotsStats()

  const requestCurrentPosition = useCallback(() => {
    setLoadingCurrentPosition(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position)
        setLoadingCurrentPosition(false)
      },
      (error) => {
        console.error(error)
        setLoadingCurrentPosition(false)
      },
    )
  }, [])

  const handleSelectHotspot = useCallback(async (hotspot) => {
    const fetchedWitnesses = await getWitnesses(hotspot.address)
    const filteredWitnesses = fetchedWitnesses.filter(
      (w) =>
        haversineDistance(hotspot?.lng, hotspot?.lat, w.lng, w.lat) <=
        MAX_WITNESS_DISTANCE_THRESHOLD,
    )
    setSelectedHotspot({ ...hotspot, witnesses: filteredWitnesses })
    setShowInfoBox(true)
  }, [])

  const handleSelectLayer = useCallback((layer) => {
    setLayer(layer)
    setShowMapLayers(false)
  }, [])

  return (
    <Page className="overflow-hidden">
      <MetaTags
        title={'Coverage Map'}
        description={`View an interactive map of the Helium network and all the hotspots currently active around the world`}
        openGraphImageAbsoluteUrl={
          'https://explorer.helium.com/images/og/coverage.png'
        }
        url={'https://explorer.helium.com/coverage'}
      />
      <title>Helium Network - Coverage</title>
      <Header activeNav="coverage" />
      <Map
        currentPosition={currentPosition}
        selectedHotspot={selectedHotspot}
        selectHotspot={handleSelectHotspot}
        showInfoBox={showInfoBox}
        layer={layer}
      />
      <InfoBox
        showInfoBox={showInfoBox}
        toggleShowInfoBox={toggleShowInfoBox}
        showMapLayers={showMapLayers}
        toggleShowMapLayers={toggleShowMapLayers}
        selectedHotspot={selectedHotspot}
        hotspotsStats={hotspotsStats}
      />
      <MapLayersBox
        showInfoBox={showInfoBox}
        toggleShowInfoBox={toggleShowInfoBox}
        showMapLayers={showMapLayers}
        toggleShowMapLayers={toggleShowMapLayers}
        layer={layer}
        setLayer={handleSelectLayer}
      />
      <MapControls
        showInfoBox={showInfoBox}
        toggleShowInfoBox={toggleShowInfoBox}
        showMapLayers={showMapLayers}
        toggleShowMapLayers={toggleShowMapLayers}
        requestCurrentPosition={requestCurrentPosition}
        loadingCurrentPosition={loadingCurrentPosition}
      />

      <style jsx global>{`
        #__next,
        #app,
        #app article {
          height: 100%;
        }

        html,
        body {
          overscroll-behavior: none;
        }
      `}</style>
    </Page>
  )
}

export default Coverage

// export async function getStaticProps() {
//   const client = new Client()
//   const stats = await client.stats.get()
//   const count = stats.counts.hotspots

//   let props = {
//     count,
//   }

//   return {
//     props,
//     revalidate: 60,
//   }
// }
