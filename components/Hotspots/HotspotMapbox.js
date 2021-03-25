import { useState } from 'react'
import { Tooltip } from 'antd'
import { findBounds } from '../Txns/utils'
import animalHash from 'angry-purple-tiger'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import { withRouter } from 'next/router'
import ScaleControl from '../ScaleControl'
import MapButton from './MapButton'
import WitnessIcon from './WitnessIcon'

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
  gatewayMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow:
      '0px 0px 0px 20px rgba(255,255,255,0.15), 0px 0px 0px 10px rgba(255,255,255,0.15)',
    cursor: 'pointer',
  },
  witnessMarker: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#F1C40F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  nearbyMarker: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#7C88BB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
}

const HotspotMapbox = ({
  classes,
  hotspot,
  witnesses,
  nearbyHotspots = [],
  router,
}) => {
  const Mapbox = ReactMapboxGl({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  })
  
  const [showWitnesses, setShowWitnesses] = useState(true)
  const [showNearbyHotspots, setShowNearbyHotspots] = useState(true)

  const boundsLocations = []

  // include hotspot in centering / zooming logic
  boundsLocations.push({ lng: hotspot?.lng, lat: hotspot?.lat })

  // include witnesses in centering / zooming logic
  witnesses.map((w) => {
    if (showWitnesses) boundsLocations.push({ lng: w?.lng, lat: w?.lat })
  })

  // include nearby hotspots in centering / zooming logic
  nearbyHotspots.map((h) => {
    boundsLocations.push({ lng: parseFloat(h?.lng), lat: parseFloat(h?.lat) })
  })

  // calculate map bounds
  const mapBounds = findBounds(boundsLocations)

  const mapProps = {}

  if (boundsLocations.length === 1) {
    // if the hotspot doesn't have any witnesses or nearby hotspots, centre on the hotspot by itself, at a decent zoom level
    mapProps.zoom = [12]
    mapProps.center = [
      hotspot?.lng ? hotspot.lng : 0,
      hotspot?.lat ? hotspot.lat : 0,
    ]
    mapProps.fitBoundsOptions = { padding: 50, animate: true }
  } else {
    mapProps.fitBounds = mapBounds
    mapProps.fitBoundsOptions = { padding: 50, animate: true }
  }

  if (hotspot.lng !== undefined && hotspot.lat !== undefined) {
    return (
      <div className="relative">
        <MapButton
          active={showWitnesses}
          handleClick={() => setShowWitnesses((prevValue) => !prevValue)}
          icon={<WitnessIcon />}
        />
        <Mapbox
          style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
          container="map"
          className={classes}
          containerStyle={{
            width: '100%',
          }}
          movingMethod="jumpTo"
          {...mapProps}
        >
          <ScaleControl />
          {showNearbyHotspots &&
            nearbyHotspots.map((h) => (
              <Tooltip
                title={animalHash(h.address)}
                key={`nearby-${h.address}`}
              >
                <Marker
                  style={styles.nearbyMarker}
                  anchor="center"
                  coordinates={[h.lng, h.lat]}
                  onClick={() => router.push(`/hotspots/${h.address}`)}
                />
              </Tooltip>
            ))}

          <Marker
            key={hotspot.address}
            style={styles.gatewayMarker}
            anchor="center"
            coordinates={[
              hotspot.lng ? hotspot.lng : 0,
              hotspot.lat ? hotspot.lat : 0,
            ]}
          />

          {showWitnesses &&
            witnesses.map((w) => (
              <>
                <Tooltip title={animalHash(w.address)}>
                  <Marker
                    key={w.address}
                    style={styles.witnessMarker}
                    anchor="center"
                    coordinates={[w.lng, w.lat]}
                    onClick={() => router.push(`/hotspots/${w.address}`)}
                  ></Marker>
                </Tooltip>
                <Layer
                  key={'line-' + w.address}
                  type="line"
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round',
                  }}
                  paint={{
                    'line-color': '#F1C40F',
                    'line-width': 2,
                    'line-opacity': 0.3,
                  }}
                >
                  <Feature
                    coordinates={[
                      [w.lng, w.lat],
                      [hotspot.lng, hotspot.lat],
                    ]}
                  />
                </Layer>
              </>
            ))}
        </Mapbox>
      </div>
    )
  } else {
    return (
      <div
        className="no-location-set"
        style={{
          backgroundColor: '#324b61',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: '#A984FF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '3px solid #8B62EA',
            boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
            marginBottom: 14,
          }}
        />
        <p style={{ fontSize: '18px', color: 'white' }}>No location set</p>
      </div>
    )
  }
}
export default withRouter(HotspotMapbox)
