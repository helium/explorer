import React from 'react'
import ReactMapboxGl, { GeoJSONLayer, Image } from 'react-mapbox-gl'
import geoJSON from 'geojson'
import GeolocationButton from './GeolocationButton'
import fetch from 'node-fetch'
import ScaleControl from '../ScaleControl'
import classNames from 'classnames'
import { HotKeys } from 'react-hotkeys'
import Ruler from '../../public/images/ruler-light.svg'
import turfDistance from '@turf/distance'
import { point as turfPoint } from '@turf/helpers'

const maxZoom = 14
const minZoom = 2

const measuringColor = '#5850EB'

const Mapbox = ReactMapboxGl({
  interactive: true,
  touchZoomRotate: true,
  maxZoom: maxZoom,
  minZoom: minZoom,
})

const onlineCircleLayout = {
  'circle-color': '#29d391',
  'circle-radius': 4,
  'circle-opacity': 1,
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
    measuring: false,
    measurements: {
      from: null,
      to: null,
    },
    distance: '',
  }

  async componentDidMount() {
    const response = await fetch('/api/coverage')
    const coverage = await response.json()
    this.setState(coverage)
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

  handleMeasureToggle = () => {
    const measuring = !this.state.measuring
    const newState = {
      measuring,
    }

    if (!measuring) {
      newState.distance = ''
      newState.measurements = {
        from: null,
        to: null,
      }
    }

    this.setState(newState)
  }

  handleMeasureCancel = () => {
    if (this.state.measuring) {
      this.setState({
        distance: '',
        measurements: {
          from: null,
          to: null,
        },
      })
    }
  }

  handleGeolocationButtonClick = () => {
    this.setState({
      center: [this.props.coords.longitude, this.props.coords.latitude],
      zoom: [12],
    })
  }

  handleClick = (_, e) => {
    if (this.state.measuring) {
      const coordinates = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      }

      let measurements
      let distance

      if (!this.state.measurements.from) {
        measurements = {
          from: coordinates,
          to: null,
        }
        distance = ''
      } else if (!this.state.measurements.to) {
        measurements = {
          from: this.state.measurements.from,
          to: coordinates,
        }
        const from = turfPoint([
          this.state.measurements.from.lng,
          this.state.measurements.from.lat,
        ])
        const to = turfPoint([coordinates.lng, coordinates.lat])
        distance = turfDistance(from, to, { units: 'meters' })
      } else {
        measurements = {
          from: null,
          to: null,
        }
        distance = ''
      }

      this.setState({
        distance,
        measurements,
      })
    }
  }

  handleHotspotClick = (e) => {
    if (this.state.measuring) {
      return
    }

    const { map } = this.state
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['online-hotspots-circle', 'offline-hotspots-circle'],
    })
    this.handleSelectHotspots(features)
    map.getCanvas().style.cursor = ''
  }

  handleSelectHotspots = (features) => {
    const { selectHotspots } = this.props
    const selectedHotspots = features.map((f) => ({
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      ...f.properties,
    }))
    selectHotspots(selectedHotspots)
  }

  handleMouseMove = (map, e) => {
    const h = map.queryRenderedFeatures(e.point, {
      layers: ['online-hotspots-circle', 'offline-hotspots-circle'],
    })
    if (this.state.measuring) {
      map.getCanvas().style.cursor = 'crosshair'
    } else if (h.length > 0) {
      map.getCanvas().style.cursor = 'pointer'
    } else {
      map.getCanvas().style.cursor = ''
    }
  }

  renderDistance = () => {
    if (this.state.distance > 1000) {
      return `${Math.round(this.state.distance / 1000)} km`
    } else {
      return `${Math.round(this.state.distance)} m`
    }
  }

  renderMeasureMap = () => {
    let line = null
    let points = []

    if (this.state.measurements.from) {
      points.push({
        ...this.state.measurements.from,
      })
    }

    if (this.state.measurements.to) {
      points.push({
        ...this.state.measurements.to,
      })
    }

    if (this.state.measurements.from && this.state.measurements.to) {
      line = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [
                  this.state.measurements.from.lng,
                  this.state.measurements.from.lat,
                ],
                [
                  this.state.measurements.to.lng,
                  this.state.measurements.to.lat,
                ],
              ],
            },
          },
        ],
      }
    } else {
      line = null
    }

    const pointData = geoJSON.parse(points, {
      Point: ['lat', 'lng'],
    })

    return (
      <>
        {line && (
          <GeoJSONLayer
            data={line}
            linePaint={{
              'line-color': measuringColor,
              'line-width': 3,
            }}
          />
        )}
        <GeoJSONLayer
          data={pointData}
          circlePaint={{
            'circle-color': measuringColor,
            'circle-radius': 8,
          }}
        />
      </>
    )
  }

  renderOverviewMap = () => {
    const { selectedHotspots, showOffline } = this.props
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
          id="offline-hotspots"
          data={(showOffline && offline) || emptyGeoJSON}
          circlePaint={offlineCircleLayout}
          circleOnClick={this.handleHotspotClick}
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
    const { hasGeolocation } = this.state

    const keyMap = {
      measuringCancel: 'escape',
      measuringToggle: 'd',
    }

    const handlers = {
      measuringCancel: this.handleMeasureCancel,
      measuringToggle: this.handleMeasureToggle,
    }

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <span className="interactive-coverage-map">
          {this.state.distance && (
            <div className="distance">{this.renderDistance()}</div>
          )}

          <button
            id="measure"
            className={classNames({
              'map-zoom-button': true,
              'map-measure-toggle-button': true,
              active: this.state.measuring,
            })}
            onClick={this.handleMeasureToggle}
          >
            <img
              src={Ruler}
              alt="Ruler"
              style={{
                width: 24,
              }}
            />
          </button>
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
            style="https://api.maptiler.com/maps/b238ec2f-4ff6-407c-a310-3dafb5f838f4/style.json?key=kNomjOqCRi7kEjO4HbFF"
            className="mapbox-object"
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
            {this.renderMeasureMap()}
            {hasGeolocation && (
              <GeolocationButton onClick={this.handleGeolocationButtonClick} />
            )}
            <ScaleControl />
          </Mapbox>
          <style jsx>{`
            .map-zoom-button {
              position: absolute;
              height: 50px;
              width: 50px;
              font-size: 24px;
              text-align: center;
              border-radius: 50% 50%;
              right: 20px;
              z-index: 3;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #050b18;
              color: #fff;
              transition: all 0.3s;
            }

            .mapbox-object {
              position: relative;
              width: 100%;
              height: 100vh;
              overflow: visible;
            }

            .map-zoom-button:hover {
              transform: scale(1.1, 1.1);
            }

            .distance {
              background: ${measuringColor};
              color: #2e3750;
              border-radius: 3px;
              padding: 5px 10px;
              position: absolute;
              right: 20px;
              top: 20px;
              z-index: 3;
            }

            .map-measure-toggle-button {
              bottom: 170px;
            }

            .map-zoom-button.map-measure-toggle-button.active {
              background: ${measuringColor};
            }

            .map-zoom-in-button {
              bottom: 110px;
            }
            .map-zoom-out-button {
              bottom: 50px;
            }
            .map-zoom-button:focus {
              outline: none;
            }

            @media screen and (max-width: 890px) {
              .map-measure-toggle-button {
                bottom: calc(70vh + 160px);
                display: none;
              }

              .map-zoom-button {
                right: 10px;
                height: 50px;
                width: 50px;
                border-radius: 6px;
                overflow: hidden;
                -webkit-appearance: none;
                font-size: 20px;
              }
              .map-zoom-in-button {
                top: 70px;
              }
              .map-zoom-out-button {
                top: 10px;
              }
            }
          `}</style>
        </span>
      </HotKeys>
    )
  }
}

export default CoverageMap
