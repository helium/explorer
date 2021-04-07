import React from 'react'
import ReactMapboxGl, { GeoJSONLayer, Image } from 'react-mapbox-gl'
import geoJSON from 'geojson'
import fetch from 'node-fetch'

const maxZoom = 14
const minZoom = 2

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: true,
  touchZoomRotate: true,
  maxZoom: maxZoom,
  minZoom: minZoom,
})

const onlineCircleLayout = {
  'circle-color': '#29d391',
  'circle-radius': 2,
  'circle-opacity': 0.7,
  'circle-blur': 0,
}

const offlineCircleLayout = {
  'circle-color': '#e86161',
  'circle-radius': 3,
  'circle-opacity': 1,
  'circle-blur': 0,
}

const emptyGeoJSON = geoJSON.parse([], {
  Point: ['lat', 'lng'],
})

class CoverageMap extends React.Component {
  state = {
    map: null,
    center: [-65.5795, 39.8283],
    zoom: [2.2],
    hasGeolocation: false,
    flyingComplete: false,
    online: null,
    offline: null,
  }

  async componentDidMount() {
    const response = await fetch('/api/coverage')
    const coverage = await response.json()
    this.setState(coverage)
  }

  renderOverviewMap = () => {
    const { selectedHotspots = [], showOffline } = this.props
    const { online, offline } = this.state

    const selectedData = geoJSON.parse(selectedHotspots[0] || [], {
      Point: ['lat', 'lng'],
    })

    // If any of the selected hotspots is online, then the displayed color will be green,
    // as online hotspots are displayed one layer above offline ones.
    const blurColor = (selectedHotspots.some(
      (hotspot) => hotspot.status === 'online',
    )
      ? onlineCircleLayout
      : offlineCircleLayout)['circle-color']

    let flying = false

    if (selectedHotspots.length > 0) {
      if (!this.state.map) return

      if (!this.state.flyingComplete) {
        if (!flying) {
          this.state.map.flyTo({
            center: [selectedHotspots[0].lng, selectedHotspots[0].lat],
            zoom: 14,
          })
          // So that we know that the map is currently flying from one location to another
          this.state.map.fire('flystart')
          flying = true
        }

        if (flying) {
          // While the flying event is happening, wait until it's completed
          // (either by the user interrupting it, or once it reaches its end state)
          this.state.map.once('moveend', (event) => {
            // Once it's finished, reset the flying flag
            flying = false
            // Set the flyingComplete flag to true so this code chunk doesn't keep running
            this.setState({ flyingComplete: true })
            // Set zoom state variable to what the zoom level was when the flying event stopped
            // Without setting this, the manual zoom +/- buttons would be incrementing or
            // decrementing the zoom level from before the fly action started
            this.setState({ zoom: [event.target.transform.tileZoom] })
          })
        }
      }
    }

    return (
      <>
        <Image id="green-hex" url="/images/hex-green.png" />
        <GeoJSONLayer
          id="selected-hotspots-glow"
          data={selectedData}
          circlePaint={{
            'circle-color': blurColor,
            'circle-radius': 70,
            'circle-opacity': 0.3,
            'circle-blur': 1,
          }}
        />

        <GeoJSONLayer
          id="online-hotspots"
          data={online || emptyGeoJSON}
          circlePaint={onlineCircleLayout}
          circleOnClick={this.handleHotspotClick}
        />
      </>
    )
  }

  render() {
    return (
      <>
        <Mapbox
          style="mapbox://styles/petermain/ckmwdn50a1ebk17o3h5e6wwui"
          className="h-screen w-screen"
          center={this.state.center}
          zoom={this.state.zoom}
          onStyleLoad={(map) => {
            this.setState({ map })
          }}
          ref={(e) => {
            this.map = e
          }}
          onClick={this.handleClick}
          onMouseMove={this.handleMouseMove}
        >
          {this.renderOverviewMap()}
        </Mapbox>
      </>
    )
  }
}

export default CoverageMap
