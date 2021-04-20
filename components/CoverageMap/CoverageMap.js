import React, { useState, useEffect } from 'react'
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
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: true,
  touchZoomRotate: true,
  maxZoom: maxZoom,
  minZoom: minZoom,
  hash: true,
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

const CoverageMap = ({ selectedHotspots, selectHotspots, showOffline }) => {
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState([-65.5795, 39.8283])
  const [zoom, setZoom] = useState([2.2])
  const [hasGeolocation, setHasGeolocation] = useState(false)
  const [online, setOnline] = useState(null)
  const [offline, setOffline] = useState(null)
  const [measuring, setMeasuring] = useState(false)
  const [measurements, setMeasurements] = useState({ from: null, to: null })
  const [distance, setDistance] = useState('')

  useEffect(() => {
    const getHotspots = async () => {
      const response = await fetch('/api/coverage')
      const coverage = await response.json()
      const { offline, online } = coverage
      setOffline(offline)
      setOnline(online)
    }
    getHotspots()
  }, [])

  const handleMapZoomButtons = (event) => {
    const zoomArray = zoom

    if (event.target.id === 'zoom-in' && zoomArray[0] !== maxZoom) {
      setZoom((prevZoom) => [prevZoom[0] + 1])
    } else if (event.target.id === 'zoom-out' && zoomArray[0] !== minZoom) {
      setZoom((prevZoom) => [prevZoom[0] - 1])
    }
  }

  const handleMeasureToggle = () => {
    const isMeasuring = !measuring
    setMeasuring(isMeasuring)

    if (!isMeasuring) {
      setDistance('')
      setMeasurements({ from: null, to: null })
    }
  }

  const handleMeasureCancel = () => {
    if (measuring) {
      setDistance('')
      setMeasurements({ from: null, to: null })
    }
  }

  const handleGeolocationButtonClick = () => {
    setCenter([coords.longitude, coords.latitude])
    setZoom([12])
  }

  const handleClick = (_, e) => {
    if (measuring) {
      const coordinates = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      }

      let measurements
      let distance

      if (!measurements.from) {
        measurements = {
          from: coordinates,
          to: null,
        }
        distance = ''
      } else if (!measurements.to) {
        measurements = {
          from: measurements.from,
          to: coordinates,
        }
        const from = turfPoint([measurements.from.lng, measurements.from.lat])
        const to = turfPoint([coordinates.lng, coordinates.lat])
        distance = turfDistance(from, to, { units: 'meters' })
      } else {
        measurements = {
          from: null,
          to: null,
        }
        distance = ''
      }

      setDistance(distance)
      setMeasurements(measurements)
    }
  }

  const handleHotspotClick = (e) => {
    if (measuring) {
      return
    }

    const features = map.queryRenderedFeatures(e.point, {
      layers: ['online-hotspots-circle', 'offline-hotspots-circle'],
    })
    handleSelectHotspots(features)
    map.getCanvas().style.cursor = ''
  }

  const handleSelectHotspots = (features) => {
    const selectedHotspots = features.map((f) => ({
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      ...f.properties,
    }))
    selectHotspots(selectedHotspots)
  }

  const handleMouseMove = (map, e) => {
    const h = map.queryRenderedFeatures(e.point, {
      layers: ['online-hotspots-circle', 'offline-hotspots-circle'],
    })
    if (measuring) {
      map.getCanvas().style.cursor = 'crosshair'
    } else if (h.length > 0) {
      map.getCanvas().style.cursor = 'pointer'
    } else {
      map.getCanvas().style.cursor = ''
    }
  }

  const renderDistance = () => {
    if (distance > 1000) {
      return `${Math.round(distance / 1000)} km`
    } else {
      return `${Math.round(distance)} m`
    }
  }

  const renderMeasureMap = () => {
    let line = null
    let points = []

    if (measurements.from) {
      points.push({
        ...measurements.from,
      })
    }

    if (measurements.to) {
      points.push({
        ...measurements.to,
      })
    }

    if (measurements.from && measurements.to) {
      line = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [measurements.from.lng, measurements.from.lat],
                [measurements.to.lng, measurements.to.lat],
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

  const renderOverviewMap = () => {
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

    if (selectedHotspots.length > 0) {
      if (!map) return
      map.flyTo({
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
          circleOnClick={handleHotspotClick}
        />

        <GeoJSONLayer
          id="online-hotspots"
          data={online || emptyGeoJSON}
          circlePaint={onlineCircleLayout}
          circleOnClick={handleHotspotClick}
        />
      </>
    )
  }

  const keyMap = {
    measuringCancel: 'escape',
    measuringToggle: 'd',
  }

  const handlers = {
    measuringCancel: handleMeasureCancel,
    measuringToggle: handleMeasureToggle,
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <span className="interactive-coverage-map">
        {distance && <div className="distance">{renderDistance()}</div>}

        <button
          id="measure"
          className={classNames({
            'map-zoom-button': true,
            'map-measure-toggle-button': true,
            active: measuring,
          })}
          onClick={handleMeasureToggle}
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
          onClick={handleMapZoomButtons}
        >
          <span id="zoom-in" className="unselectable-text">
            +
          </span>
        </button>
        <button
          id="zoom-out"
          className="map-zoom-button map-zoom-out-button"
          onClick={handleMapZoomButtons}
        >
          <span id="zoom-out" className="unselectable-text">
            -
          </span>
        </button>
        <Mapbox
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          className="mapbox-object"
          center={center}
          zoom={zoom}
          onStyleLoad={(map) => {
            setMap(map)
          }}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onZoomEnd={(zoom) => {}}
        >
          {renderOverviewMap()}
          {renderMeasureMap()}
          {hasGeolocation && (
            <GeolocationButton onClick={handleGeolocationButtonClick} />
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

export default CoverageMap
