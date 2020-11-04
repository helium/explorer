import React, { useState } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/CoverageMap/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import HotspotSidebar from '../components/CoverageMap/HotspotSidebar'
import { fetchHotspots } from '../data/hotspots'
import { Client } from '@helium/http'

const Map = dynamic(() => import('../components/CoverageMap/CoverageMap'), {
  ssr: false,
  loading: () => <div />,
})
const Coverage = (props) => {
  const { hotspots, count } = props
  const [selectedHotspots, setSelectedHotspots] = useState([])

  const selectHotspots = (hotspots) => {
    setSelectedHotspots(castArray(hotspots))
  }

  const clearSelectedHotspots = () => {
    setSelectedHotspots([])
  }

  return (
    <Page>
      <title>Helium Network - Coverage</title>
      <Header activeNav="coverage" />
      <HotspotSidebar
        hotspots={hotspots}
        count={count}
        selectedHotspots={selectedHotspots}
        selectHotspots={selectHotspots}
        clearSelectedHotspots={clearSelectedHotspots}
      />
      <Map
        hotspots={hotspots}
        selectedHotspots={selectedHotspots}
        selectHotspots={selectHotspots}
        clearSelectedHotspots={clearSelectedHotspots}
      />
    </Page>
  )
}

export default Coverage

export async function getStaticProps() {
  const client = new Client()
  const stats = await client.stats.get()
  const newCount = stats.counts.hotspots

  const newHotspots = await fetchHotspots()

  let props = {
    hotspots: newHotspots,
    count: newCount,
  }

  return {
    props,
    revalidate: 60,
  }
}
