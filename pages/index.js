import React, { useCallback, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import dynamic from 'next/dynamic'
import Header from '../components/Nav/Header'
import Page from '../components/CoverageMap/Page'
import MetaTags from '../components/AppLayout/MetaTags'
import MapLayersBox from '../components/Map/MapLayersBox'
import MapControls from '../components/Map/MapControls'
import OverviewInfoBox from '../components/InfoBox/OverviewInfoBox'
import HotspotsInfoBox from '../components/InfoBox/HotspotsInfoBox'
import HotspotDetailsInfoBox from '../components/InfoBox/HotspotDetailsInfoBox'

const Map = dynamic(() => import('../components/Map/Map'), {
  ssr: false,
  loading: () => <div />,
})

const Index = () => {
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
      <Map />
      <Switch>
        <Route path="/hotspots/:address">
          <HotspotDetailsInfoBox />
        </Route>
        <Route path="/hotspots">
          <HotspotsInfoBox />
        </Route>
        <Route path="/">
          <OverviewInfoBox />
        </Route>
      </Switch>
      <MapLayersBox />
      <MapControls />

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

export default Index
