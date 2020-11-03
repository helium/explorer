import React, { useState } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/CoverageMap/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import HotspotSidebar from '../components/CoverageMap/HotspotSidebar'
import { fetchHotspots } from '../data/hotspots'

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
  let props = {}

  await fetch('https://api.helium.io/v1/stats')
    .then((res) => res.json())
    .then((stats) => {
      let newCount = stats.data.counts.hotspots
      props = {
        ...props,
        count: newCount,
      }
    })
  const newHotspots = await fetchHotspots()
  props = {
    ...props,
    hotspots: newHotspots,
  }

  return {
    props,
    revalidate: 60,
  }
}
