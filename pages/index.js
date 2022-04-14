import React from 'react'
import dynamic from 'next/dynamic'
import { useHistory, useLocation } from 'react-router'
import Header from '../components/Nav/Header'
import Page from '../components/CoverageMap/Page'
import MapLayersBox from '../components/Map/MapLayersBox'
import InfoBoxSwitch from '../components/InfoBox/InfoBoxSwitch'
import useKeydown from '../hooks/useKeydown'
import useGA from '../hooks/useGA'
import Head from 'next/head'
import mapboxglSupported from '@mapbox/mapbox-gl-supported'
import { Helmet } from 'react-helmet'

const mapSupported = mapboxglSupported.supported()

if (!mapSupported) {
  console.error(
    'WebGL was not able to initialize in your browser. Please try on another device or browser to enable the full functionality of the Helium Explorer.',
  )
}

const Map = dynamic(() => import('../components/Map/Map'), {
  ssr: false,
  loading: () => <div />,
})

export const Index = ({ coverageUrl }) => {
  useGA()
  const history = useHistory()
  const location = useLocation()

  useKeydown({
    Escape: () => {
      history.push(location.pathname.split('/').slice(0, -1).join('/') || '/')
    },
  })

  return (
    <Page>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <Helmet>
        <title data-react-helmet="true">Helium Explorer</title>
      </Helmet>
      <Header activeNav="coverage" />
      {mapSupported && <Map coverageUrl={coverageUrl} />}
      <InfoBoxSwitch />
      <MapLayersBox />
    </Page>
  )
}

export default Index
