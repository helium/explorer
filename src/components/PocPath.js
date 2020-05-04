import React, { Component } from 'react'
import Client from '@helium/http'
import Map from '../components/Map'

const initialState = {
  hotspots: [],
  loading: true,
  loadingInitial: true,
}

class PocPath extends Component {
  state = initialState

  async componentDidMount() {
    this.client = new Client()
    const { path } = this.props
    const pathHotspots = await Promise.all(
      path.map((p) => this.client.hotspots.get(p.challengee)),
    )
    this.setState({ loadingInitial: false, hotspots: pathHotspots })
  }

  render() {
    const { hotspots, loadingInitial } = this.state
    if (!loadingInitial) {
      return <Map coords={hotspots} />
    } else {
      return <div> doh</div>
    }
  }
}

export default PocPath
