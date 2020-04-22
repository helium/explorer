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
    let counter = 0
    this.client = new Client()
    const { hotspots } = this.state
    const { path } = this.props    
    await Promise.all(
      path.map(async p => {
        counter++
        const hotspot = await this.client.hotspots.get(p.challengee)
        await hotspots.push(hotspot)
        await this.setState({ hotspots })    
      }),
    )
    if (counter == path.length) {
      await this.setState({ loadingInitial: false })
    }
  }

  render() {
    const { hotspots, loadingInitial } = this.state
    if (!loadingInitial) {
      return (<Map coords={hotspots} />)
    } else {
      return (<div> doh</div>)
    }
  }
}

export default PocPath
