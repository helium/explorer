import React from 'react'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl'
import fetch from 'node-fetch'

const Mapbox = ReactMapboxGl({
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
          style="https://api.maptiler.com/maps/2469a8ae-f7e5-4ed1-b856-cd312538e33b/style.json?key=kNomjOqCRi7kEjO4HbFF"
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
