import React, { useEffect, useState } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/CoverageMap/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import HotspotSidebar from '../components/CoverageMap/HotspotSidebar'
import Client from '@helium/http'
import MetaTags from '../components/AppLayout/MetaTags'

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

    console.log(hotspots)
  }

  const clearSelectedHotspots = () => {
    setSelectedHotspots([])
  }

  const [selectedHotspotLoading, setSelectedHotspotLoading] = useState(false)
  const [selectedHotspotData, setSelectedHotspotData] = useState(false)
  useEffect(() => {
    const client = new Client()
    const getSelectedHotspotData = async () => {
      setSelectedHotspotLoading(true)
      const selectedHotspotId = selectedHotspots[0].address
      console.log(selectedHotspots)
      console.log(selectedHotspotId)
      const selectedHotspotDataResponse = await client.hotspots.get(
        selectedHotspotId,
      )
      const selectedHotspotWitnesses = await fetch(
        `https://api.helium.io/v1/hotspots/${selectedHotspotId}/witnesses`,
      )
        .then((res) => res.json())
        .then((json) =>
          json.data.filter((w) => !(w.address === selectedHotspotId)),
        )

      selectedHotspotDataResponse.witnessesData = selectedHotspotWitnesses
      console.log(selectedHotspotDataResponse)

      setSelectedHotspotData(selectedHotspotDataResponse)
      setSelectedHotspotLoading(false)
    }
    if (selectedHotspots.length === 1) {
      getSelectedHotspotData()
    }
  }, [selectedHotspots])

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
        hotspots={hotspots}
        count={count}
        selectedHotspots={selectedHotspots}
        selectedHotspotLoading={selectedHotspotLoading}
        selectedHotspotData={selectedHotspotData}
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
