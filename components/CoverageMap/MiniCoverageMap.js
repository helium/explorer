import React from 'react'
import ReactMapboxGl, { GeoJSONLayer, Image } from 'react-mapbox-gl'
import geoJSON from 'geojson'
// import get from 'lodash/get'
import { Spin } from 'antd'
import GeolocationButton from './GeolocationButton'

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
  interactive: false,
  touchZoomRotate: false,
  maxZoom: 14,
  minZoom: 0,
})

const circleLayout = {
  'circle-color': '#29d391',
  'circle-radius': 3,
  'circle-opacity': 0.5,
  'circle-blur': 0.95,
}

class CoverageMap extends React.Component {
  //  map = React.createRef()

  state = {
    map: null,
    center: [-98.5795, 39.8283],
    zoom: [3],
    hasGeolocation: false,
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isGeolocationEnabled &&
      prevProps.coords === null &&
      this.props.coords !== null
    ) {
      this.setState({ hasGeolocation: true })
    }
  }

  renderOverviewMap = () => {
    const { hotspots, hotspotsLoading } = this.props

    const data = geoJSON.parse(hotspots, { Point: ['lat', 'lng'] })

    return (
      <React.Fragment>
        <Image id="green-hex" url="/images/hex-green.png" />
        {hotspotsLoading && (
          <span className="green-spin">
            <Spin size="large" />
          </span>
        )}
        <GeoJSONLayer id="hotspots" data={data} circlePaint={circleLayout} />
      </React.Fragment>
    )
  }

  render() {
    const { hasGeolocation } = this.state
    const { zoomLevel } = this.props

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
          // center={this.state.center}
          zoom={[zoomLevel]}
          onStyleLoad={(map) => {
            this.setState({ map })
          }}
          ref={(e) => {
            this.map = e
          }}
        >
          {this.renderOverviewMap()}
          {hasGeolocation && (
            <GeolocationButton onClick={this.handleGeolocationButtonClick} />
          )}
        </Mapbox>
      </span>
    )
  }
}

export default CoverageMap
