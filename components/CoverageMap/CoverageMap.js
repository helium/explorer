import React from 'react'
import ReactMapboxGl, { GeoJSONLayer, Image } from 'react-mapbox-gl'
import geoJSON from 'geojson'
import get from 'lodash/get'
import GeolocationButton from './GeolocationButton'

const maxZoom = 14
const minZoom = 3

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
  interactive: true,
  touchZoomRotate: true,
  maxZoom: maxZoom,
  minZoom: minZoom,
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
    flyingComplete: false,
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isGeolocationEnabled &&
      prevProps.coords === null &&
      this.props.coords !== null
    ) {
      this.setState({ hasGeolocation: true })
    }

    if (
      // If the selected hotspots change...
      prevProps.selectedHotspots !== this.props.selectedHotspots ||
      // or if the same already selected hotspot is selected again...
      (prevProps.selectedHotspots.length > 0 &&
        this.props.selectedHotspots > 0 &&
        prevProps.selectedHotspots[0].address ===
          this.props.selectedHotspots[0].address)
    ) {
      // reset the flyingComplete flag so the flying event can start again
      this.setState({ flyingComplete: false })
    }
  }

  handleMapZoomButtons = (event) => {
    const zoomArray = this.state.zoom

    if (event.target.id === 'zoom-in' && zoomArray[0] !== maxZoom) {
      this.setState((prevState) => ({ zoom: [prevState.zoom[0] + 1] }))
    } else if (event.target.id === 'zoom-out' && zoomArray[0] !== minZoom) {
      this.setState((prevState) => ({ zoom: [prevState.zoom[0] - 1] }))
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
        <button
          id="zoom-in"
          className="map-zoom-button map-zoom-in-button"
          onClick={this.handleMapZoomButtons}
        >
          <span id="zoom-in" className="unselectable-text">
            +
          </span>
        </button>
        <button
          id="zoom-out"
          className="map-zoom-button map-zoom-out-button"
          onClick={this.handleMapZoomButtons}
        >
          <span id="zoom-out" className="unselectable-text">
            -
          </span>
        </button>
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
        <style jsx>{`
          .map-zoom-button {
            position: absolute;
            height: 50px;
            width: 50px;
            font-size: 24px;
            text-align: center;
            border-radius: 50px;
            right: 20px;
            z-index: 3;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(12, 21, 30);
            color: white;
            transition: all 0.3s;
          }
          .map-zoom-button:hover {
            transform: scale(1.1, 1.1);
          }

          .map-zoom-in-button {
            bottom: 110px;
          }
          .map-zoom-out-button {
            bottom: 40px;
          }
          .map-zoom-button:focus {
            outline: none;
          }

          @media screen and (max-width: 890px) {
            .map-zoom-button {
              right: 10px;
            }
            .map-zoom-in-button {
              bottom: calc(50vh + 70px);
            }
            .map-zoom-out-button {
              bottom: calc(50vh + 10px);
            }
          }
        `}</style>
      </span>
    )
  }
}

export default CoverageMap
