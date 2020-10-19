import React, { Component } from 'react'
import castArray from 'lodash/castArray'
import Header from '../components/CoverageMap/Header'
import Page from '../components/CoverageMap/Page'
// import dynamic from 'next/dynamic'
import Client from '@helium/http'
import HotspotSidebar from '../components/CoverageMap/HotspotSidebar'
import { fetchHotspots } from '../data/hotspots'

// const Map = dynamic(() => import('../components/CoverageMap'), {
//   ssr: false,
//   loading: () => <div />,
// })

import Map from '../components/CoverageMap/CoverageMap'

export default class Coverage extends Component {
  state = {
    selectedHotspots: [],
    hotspots: [],
    hotspotsLoading: false,
    count: 0,
  }

  selectHotspots = (hotspots) => {
    this.setState({ selectedHotspots: castArray(hotspots) })
  }

  clearSelectedHotspots = () => this.setState({ selectedHotspots: [] })

  componentDidMount() {
    this.client = new Client()
    this.loadHotspots()

    fetch('https://api.helium.io/v1/stats')
      .then((res) => res.json())
      .then((stats) => {
        this.setState({
          count: stats.data.counts.hotspots,
        })
      })
  }

  async loadHotspots() {
    this.setState({ hotspotsLoading: true })
    const list = await this.client.hotspots.list()
    const allSpots = await list.take(5000)
    // TODO: figure out why this is taking so long to load
    this.setState({ hotspots: [], hotspotsLoading: false })
  }

  async componentDidUpdate(prevProps) {
    // if (prevProps.blockHeight !== this.props.blockHeight) {
    //   console.log('refetch!')
    //   fetch('https://api.helium.io/v1/stats')
    //     .then((res) => res.json())
    //     .then((stats) => {
    //       this.setState({
    //         count: stats.data.counts.hotspots,
    //       })
    //     })
    //   const hotspots = await fetchHotspots()
    //   if (this.state.hotspots.length !== hotspots.length) {
    //     this.setState({ hotspots: hotspots })
    //   }
    // }
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
