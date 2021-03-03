import { useState } from 'react'
import { Tooltip } from 'antd'
import { findBounds } from '../Txns/utils'
import animalHash from 'angry-purple-tiger'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import { withRouter } from 'next/router'
import ScaleControl from '../ScaleControl'
import MapButton from '../../components/MapButton'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
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
  // showWitnesses,
  nearbyHotspots = [],
  // showNearbyHotspots,
  router,
}) => {
  const [showWitnesses, setShowWitnesses] = useState(true)
  const [showNearbyHotspots, setShowNearbyHotspots] = useState(true)

  const boundsLocations = []
  // include hotspot in centering / zooming logic
  boundsLocations.push({ lng: hotspot?.lng, lat: hotspot?.lat })

  // include witnesses in centering / zooming logic
  witnesses.map((w) => boundsLocations.push({ lng: w?.lng, lat: w?.lat }))

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
  } else {
    mapProps.fitBounds = mapBounds
    mapProps.fitBoundsOptions = { padding: 50, animate: false }
  }

  if (hotspot.lng !== undefined && hotspot.lat !== undefined) {
    return (
      <div className="relative">
        {/* <MapButton
          classes="left-5 bottom-5"
          checked={showWitnesses}
          handleToggle={(e) => setShowWitnesses(e.target.checked)}
        >
          <svg
            width="26"
            height="20"
            viewBox="0 0 26 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.0908 0.92334C7.22682 0.92334 2.2638 4.77721 0.59549 10.0899C2.2638 15.4025 7.22682 19.2564 13.0908 19.2564C18.9548 19.2564 23.9178 15.4025 25.5861 10.0899C23.9178 4.77721 18.9548 0.92334 13.0908 0.92334ZM16.7946 13.7937C17.7769 12.8114 18.3288 11.4791 18.3288 10.0899C18.3288 8.70067 17.7769 7.36836 16.7946 6.38604C15.8123 5.40372 14.48 4.85186 13.0908 4.85186C11.7016 4.85186 10.3693 5.40372 9.38695 6.38604C8.40463 7.36836 7.85277 8.70067 7.85277 10.0899C7.85277 11.4791 8.40463 12.8114 9.38695 13.7937C10.3693 14.776 11.7016 15.3279 13.0908 15.3279C14.48 15.3279 15.8123 14.776 16.7946 13.7937ZM14.9425 11.9418C14.4513 12.433 13.7852 12.7089 13.0905 12.7089C12.3959 12.7089 11.7298 12.433 11.2386 11.9418C10.7475 11.4507 10.4715 10.7845 10.4715 10.0899C10.4715 9.3953 10.7475 8.72915 11.2386 8.23799C11.7298 7.74683 12.3959 7.4709 13.0905 7.4709C13.7852 7.4709 14.4513 7.74683 14.9425 8.23799C15.4336 8.72915 15.7096 9.3953 15.7096 10.0899C15.7096 10.7845 15.4336 11.4507 14.9425 11.9418Z"
              fill="white"
            />
          </svg>
        </MapButton> */}
        <Mapbox
          style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
          container="map"
          className={`${classes}`}
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
