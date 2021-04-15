import React, { useCallback, useState } from 'react'
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom'
import dynamic from 'next/dynamic'
import Header from '../components/Nav/Header'
import Page from '../components/CoverageMap/Page'
import MetaTags from '../components/AppLayout/MetaTags'
import useToggle from '../utils/useToggle'
import MapLayersBox from '../components/Map/MapLayersBox'
import MapControls from '../components/Map/MapControls'
import { haversineDistance } from '../utils/location'
import { useHotspotsStats } from '../data/hotspots'
import OverviewInfoBox from '../components/InfoBox/OverviewInfoBox'
import HotspotsInfoBox from '../components/InfoBox/HotspotsInfoBox'
import HotspotDetailsInfoBox from '../components/InfoBox/HotspotDetailsInfoBox'

const MAX_WITNESS_DISTANCE_THRESHOLD = 200

const Map = dynamic(() => import('../components/Map/Map'), {
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
  const history = useHistory()
  const matchHotspotDetails = useRouteMatch('/hotspots/:address')

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

  const handleSelectHotspot = useCallback(
    async (hotspot) => {
      const fetchedWitnesses = await getWitnesses(hotspot.address)
      const filteredWitnesses = fetchedWitnesses.filter(
        (w) =>
          haversineDistance(hotspot?.lng, hotspot?.lat, w.lng, w.lat) <=
          MAX_WITNESS_DISTANCE_THRESHOLD,
      )
      setSelectedHotspot({ ...hotspot, witnesses: filteredWitnesses })
      setShowInfoBox(true)
      history.push(`/hotspots/${hotspot.address}`)
    },
    [history, setShowInfoBox],
  )

  const handleSelectLayer = useCallback(
    (layer) => {
      setLayer(layer)
      setShowMapLayers(false)
    },
    [setShowMapLayers],
  )

  // Match locales with regular expression containing each locale separated by `|`
  const base = '/:locale(en|fr)?'

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
        selectedHotspot={matchHotspotDetails ? selectedHotspot : undefined}
        selectHotspot={handleSelectHotspot}
        showInfoBox={showInfoBox}
        layer={layer}
      />
      <Switch>
        <Route path={`${base}/hotspots/:address`}>
          <HotspotDetailsInfoBox
            hotspot={selectedHotspot}
            visible={showInfoBox}
            toggleVisible={toggleShowInfoBox}
          />
        </Route>
        <Route path={`${base}/hotspots`}>
          <HotspotsInfoBox
            stats={hotspotsStats}
            visible={showInfoBox}
            toggleVisible={toggleShowInfoBox}
          />
        </Route>
        <Route path={base}>
          <OverviewInfoBox
            stats={hotspotsStats}
            visible={showInfoBox}
            toggleVisible={toggleShowInfoBox}
          />
        </Route>
      </Switch>
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
