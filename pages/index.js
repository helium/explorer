import React from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Nav/Header'
import Page from '../components/CoverageMap/Page'
import MetaTags from '../components/AppLayout/MetaTags'
import MapLayersBox from '../components/Map/MapLayersBox'
import MapControls from '../components/Map/MapControls'
import InfoBoxSwitch from '../components/InfoBox/InfoBoxSwitch'
import { latestCoverageUrl } from './api/coverage'
// const { getCache } = require('../commonjs/redis')
// const { emptyCoverage } = require('../commonjs/coverage')

const Map = dynamic(() => import('../components/Map/Map'), {
  ssr: false,
  loading: () => <div />,
})

const Index = ({ coverageUrl }) => {
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
      <Map coverageUrl={coverageUrl} />
      <InfoBoxSwitch />
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

export async function getStaticProps() {
  const coverageUrl = await latestCoverageUrl()
  return {
    props: { coverageUrl },
    revalidate: 60,
  }
}

export default Index
