import React, { useEffect, useState } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/CoverageMap/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import HotspotSidebar from '../components/CoverageMap/HotspotSidebar'
import { Client } from '@helium/http'
import MetaTags from '../components/AppLayout/MetaTags'
import { useContext } from 'react'
import BetaBannerContext from '../components/BetaBanner/BannerContext'

const Map = dynamic(() => import('../components/CoverageMap/CoverageMap'), {
  ssr: false,
  loading: () => <div />,
})

const hotspotToObj = (hotspot) => ({
  ...hotspot,
  location: hotspot.geocode.longCity + ', ' + hotspot.geocode.shortState,
})

const Coverage = (props) => {
  const { count } = props
  const [hotspotList, setHotspotList] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [selectedHotspots, setSelectedHotspots] = useState([])
  const [showOffline, setShowOffline] = useState(true)

  useEffect(() => {
    const setupHotspotList = async () => {
      const client = new Client()
      setHotspotList(await client.hotspots.list())
    }
    setupHotspotList()
  }, [])

  useEffect(() => {
    const setupInitialHotspots = async () => {
      if (!hotspotList) return
      const initialHotspots = (await hotspotList.take(20)).map(hotspotToObj)
      setHotspots(initialHotspots)
    }
    setupInitialHotspots()
  }, [hotspotList])

  const fetchMoreHotspots = async () => {
    const newHotspots = (await hotspotList.take(20)).map(hotspotToObj)
    setHotspots([...hotspots, ...newHotspots])
  }

  const selectHotspots = (hotspots) => {
    setSelectedHotspots(castArray(hotspots))
  }

  const clearSelectedHotspots = () => {
    setSelectedHotspots([])
  }

  const { showBetaBanner, toggleBetaBanner } = useContext(BetaBannerContext)

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
      <HotspotSidebar
        showBetaBanner={showBetaBanner}
        toggleBetaBanner={toggleBetaBanner}
        hotspots={hotspots}
        count={count}
        selectedHotspots={selectedHotspots}
        selectHotspots={selectHotspots}
        clearSelectedHotspots={clearSelectedHotspots}
        fetchMoreHotspots={fetchMoreHotspots}
        setShowOffline={setShowOffline}
        showOffline={showOffline}
      />
      <Map
        selectedHotspots={selectedHotspots}
        selectHotspots={selectHotspots}
        clearSelectedHotspots={clearSelectedHotspots}
        showOffline={showOffline}
      />
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
