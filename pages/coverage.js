import React, { Component } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/CoverageMap/Header'
import Page from '../components/CoverageMap/Page'
import dynamic from 'next/dynamic'
import HotspotSidebar from '../components/CoverageMap/HotspotSidebar'
// import { fetchHotspots } from '../data/hotspots'
import Client from '@helium/http'

const Map = dynamic(() => import('../components/CoverageMap/CoverageMap'), {
  ssr: false,
  loading: () => <div />,
})

export const fetchHotspots = async () => {
  const client = new Client()
  const list = await client.hotspots.list()
  const hotspotsList = await list.take(15000)
  if (hotspotsList) {
    // console.log(hotspotsList)
    const hotspots = hotspotsList.map((h) => ({
      location: h.geocode.longCity + ', ' + h.geocode.shortState,
      score: Math.round(h.score * 100),
      address: h.address,
      owner: h.owner,
      lat: h.lat,
      lng: h.lng,
    }))

    return hotspots.filter(function (item) {
      return item.lat
    })
  } else {
    return []
  }
}

export default class Coverage extends Component {
  state = {
    selectedHotspots: [],
    hotspots: [],
    count: 0,
  }

  selectHotspots = (hotspots) => {
    this.setState({ selectedHotspots: castArray(hotspots) })
  }

  clearSelectedHotspots = () => this.setState({ selectedHotspots: [] })

  async componentDidMount() {
    fetch('https://api.helium.io/v1/stats')
      .then((res) => res.json())
      .then((stats) => {
        this.setState({
          count: stats.data.counts.hotspots,
        })
      })
    const hotspots = await fetchHotspots()
    this.setState({ hotspots: hotspots })
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.blockHeight !== this.props.blockHeight) {
      console.log('refetch!')
      fetch('https://api.helium.io/v1/stats')
        .then((res) => res.json())
        .then((stats) => {
          this.setState({
            count: stats.data.counts.hotspots,
          })
        })
      const hotspots = await fetchHotspots()
      if (this.state.hotspots.length !== hotspots.length) {
        this.setState({ hotspots: hotspots })
      }
    }
  }

  render() {
    const { hotspots, selectedHotspots } = this.state

    return (
      <Page>
        <title>Helium Network - Coverage</title>
        <Header activeNav="coverage" />
        <HotspotSidebar
          hotspots={this.state.hotspots}
          count={this.state.count}
          selectedHotspots={selectedHotspots}
          selectHotspots={this.selectHotspots}
          clearSelectedHotspots={this.clearSelectedHotspots}
          toggleActiveHotspot={this.toggleActiveHotspot}
        />
        <Map
          hotspots={hotspots}
          selectedHotspots={selectedHotspots}
          selectHotspots={this.selectHotspots}
          clearSelectedHotspots={this.clearSelectedHotspots}
        />
      </Page>
    )
  }
}
