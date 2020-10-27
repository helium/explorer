import React from 'react'
import ReactMapboxGl, { GeoJSONLayer, Image } from 'react-mapbox-gl'
import geoJSON from 'geojson'
import get from 'lodash/get'
import GeolocationButton from './GeolocationButton'

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
  interactive: true,
  touchZoomRotate: true,
  maxZoom: 14,
  minZoom: 3,
})

const circleLayout = {
  'circle-color': '#29d391',
  'circle-radius': 5,
  'circle-opacity': 1,
  'circle-blur': 0,
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

  handleGeolocationButtonClick = () => {
    this.setState({
      center: [this.props.coords.longitude, this.props.coords.latitude],
      zoom: [12],
    })
  }

  handleHotspotClick = (e) => {
    const { map } = this.state
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['hotspots-circle'],
    })
    this.handleSelectHotspots(features)
  }

  handleSelectHotspots = (features) => {
    const { hotspots, selectHotspots } = this.props
    const selectedAddresses = features.map((f) => get(f, 'properties.address'))
    const selectedHotspots = hotspots.filter((h) =>
      selectedAddresses.includes(h.address),
    )
    selectHotspots(selectedHotspots)
  }

  renderOverviewMap = () => {
    const { hotspots, selectedHotspots } = this.props

    const data = geoJSON.parse(hotspots, { Point: ['lat', 'lng'] })
    const selectedData = geoJSON.parse(selectedHotspots[0] || [], {
      Point: ['lat', 'lng'],
    })

    if (selectedHotspots.length > 0) {
      if (!this.state.map) return
      this.state.map.flyTo({
        center: [selectedHotspots[0].lng, selectedHotspots[0].lat],
        zoom: 14,
      })
    }

    return (
      <>
        <Image id="green-hex" url="/images/hex-green.png" />
        <GeoJSONLayer
          id="selected-hotspots-glow"
          data={selectedData}
          circlePaint={{
            'circle-color': '#29d391',
            'circle-radius': 70,
            'circle-opacity': 0.3,
            'circle-blur': 1,
          }}
        />
        <GeoJSONLayer
          id="hotspots"
          data={data}
          circlePaint={circleLayout}
          circleOnClick={this.handleHotspotClick}
          circlelOnMouseEnter={() =>
            (this.state.map.getCanvas().style.cursor = 'pointer')
          }
          circleOnMouseLeave={() =>
            (this.state.map.getCanvas().style.cursor = '')
          }
        />
      </>
    )
  }

  render() {
    const { hasGeolocation } = this.state

    return (
      <span className="interactive-coverage-map">
        <Mapbox
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          containerStyle={{
            position: 'relative',
            width: '100%',
            overflow: 'visible',
          }}
          center={this.state.center}
          zoom={this.state.zoom}
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
