import React, { Component } from 'react'
import Client from '@helium/http'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
})

const styles = {
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#1B8DFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  transmittingMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  gatewayMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#A984FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #8B62EA',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

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
      return (
        <Mapbox
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          container="map"
          center={[
            hotspots[0].lng ? hotspots[0].lng : 0,
            hotspots[0].lat ? hotspots[0].lat : 0,
          ]}
          containerStyle={{
            height: '600px',
            width: '100%',
          }}
          zoom={[11]}
          movingMethod="jumpTo"
        >
          {hotspots.map((hotspot) => {
            return (
              <Marker
                key={hotspot.address}
                style={styles.gatewayMarker}
                anchor="center"
                coordinates={[hotspot.lng, hotspot.lat]}
              />
            )
          })}
        </Mapbox>
      )
    } else {
      return <div>loading</div>
    }
  }
}

export default PocPath
