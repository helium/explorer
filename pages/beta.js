import React, { useEffect, useState } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/Beta/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import { Client } from '@helium/http'
import MetaTags from '../components/AppLayout/MetaTags'
import InfoBox from '../components/Beta/InfoBox'

const Map = dynamic(() => import('../components/Beta/CoverageMap'), {
  ssr: false,
  loading: () => <div />,
})

const Coverage = (props) => {
  return (
    <Page>
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
      <InfoBox />
    </Page>
  )
}

export default Coverage

export async function getStaticProps() {
  const client = new Client()
  const stats = await client.stats.get()
  const count = stats.counts.hotspots

  let props = {
    count,
  }

  return {
    props,
    revalidate: 60,
  }
}
