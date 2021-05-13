import { memo, Fragment } from 'react'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import { h3ToGeo } from 'h3-js'
import { findBounds } from '../Txns/utils'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: false,
  touchZoomRotate: false,
})

const MiniBeaconMap = ({ beacon }) => {
  const mapProps = {}

  const paths = beacon?.path || []
  const boundsLocations = []

  paths.forEach((path) => {
    if (path.challengeeLon && path.challengeeLat) {
      boundsLocations.push({ lng: path.challengeeLon, lat: path.challengeeLat })
    }

    path.witnesses.forEach((witness) => {
      if (witness.location) {
        const [lat, lng] = h3ToGeo(witness.location)
        boundsLocations.push({ lng, lat })
      }
    })
  })

  if (boundsLocations.length > 1) {
    const mapBounds = findBounds(boundsLocations)
    mapProps.fitBounds = mapBounds
    mapProps.fitBoundsOptions = { padding: 50 }
  }

  if (boundsLocations.length === 1) {
    mapProps.center = [boundsLocations[0].lng, boundsLocations[0].lat]
    mapProps.zoom = [8]
  }

  return (
    <span className="mini-beacon-map">
      <p className="mini-beacon-map-interactive-text unselectable-text">
        Click to view beacon details
      </p>
      <span className="mini-beacon-map-overlay" />
      <Mapbox
        style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
        container="map"
        className="h-80"
        containerStyle={{
          width: '100%',
        }}
        {...mapProps}
      >
        {paths.map((path) => (
          <Fragment key={path.challengee}>
            {path.witnesses.map((witness) => {
              const [witnessLat, witnessLng] = h3ToGeo(witness.location)

              return (
                <Fragment key={[path.challengee, witness.gateway].join('-')}>
                  <Marker
                    key={witness.address}
                    style={
                      witness.isValid
                        ? styles.witnessMarker
                        : styles.invalidWitnessMarker
                    }
                    anchor="center"
                    coordinates={[witnessLng, witnessLat]}
                  />
                  <Layer
                    key={['line', path.challengee, witness.gateway].join('-')}
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
                        [witnessLng, witnessLat],
                        [path.challengeeLon, path.challengeeLat],
                      ]}
                    />
                  </Layer>
                </Fragment>
              )
            })}
            <Marker
              style={styles.beaconerMarker}
              anchor="center"
              coordinates={[
                path.challengeeLon ? path.challengeeLon : 0,
                path.challengeeLat ? path.challengeeLat : 0,
              ]}
            />
          </Fragment>
        ))}
      </Mapbox>
    </span>
  )
}

const styles = {
  beaconerMarker: {
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
    zIndex: 3,
  },
  witnessMarker: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: '#F1C40F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 2,
  },
  invalidWitnessMarker: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: '#848FBD',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1,
  },
}

export default memo(MiniBeaconMap)
