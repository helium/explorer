import React from 'react'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl'
import fetch from 'node-fetch'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: false,
  touchZoomRotate: false,
  maxZoom: 14,
  minZoom: 0,
})

const circleLayout = {
  'circle-color': '#29d391',
  'circle-radius': 3,
  'circle-opacity': 0.9,
  'circle-blur': 5,
}

class MiniCoverageMap extends React.Component {
  state = {
    zoom: [3],
    online: null,
  }

  async componentDidMount() {
    const response = await fetch('/api/coverage')
    const { online } = await response.json()
    this.setState({ online })
  }

  render() {
    const { zoomLevel } = this.props
    const { online } = this.state

    return (
      <span className="mini-coverage-map">
        <p className="mini-coverage-map-interactive-text unselectable-text">
          Click to open full-screen interactive map
        </p>
        <span className="mini-coverage-map-overlay" />
        <Mapbox
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          containerStyle={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          zoom={[zoomLevel]}
        >
          {online && (
            <GeoJSONLayer
              id="coverage"
              data={online}
              circlePaint={circleLayout}
            />
          )}
        </Mapbox>
      </span>
    )
  }
}

export default MiniCoverageMap
