import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import { h3ToGeo } from 'h3-js'
import { Tooltip } from 'antd'
import animalHash from 'angry-purple-tiger'
import { findBounds } from './utils'

const Mapbox = ReactMapboxGl({})

const styles = {
  gatewaySuccess: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#09B851',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #059540',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
  gatewayFailed: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#CA0926',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #9F081F',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
  witnessMarkerValid: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#F1C40F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #B7950B',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
    opacity: 1,
  },
  witnessMarkerInvalid: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: 'grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #696969',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
    opacity: 1,
  },
  lineSuccess: {
    'line-color': '#09B851',
    'line-width': 2,
  },
  lineFailure: {
    'line-color': '#CA0926',
    'line-width': 2,
  },
  witnessLineValid: {
    'line-color': '#F1C40F',
    'line-width': 2,
    'line-opacity': 0.3,
  },
  witnessLineInvalid: {
    'line-color': 'grey',
    'line-width': 2,
    'line-opacity': 0.3,
  },
}

const PocMapbox = ({ path, showWitnesses }) => {
  const locations = []

  const pathHasLocations =
    path.length > 0 && path[0].challengeeLon && path[0].challengeeLat

  if (pathHasLocations) {
    if (path.length === 1) {
      // after beaconing challenges
      path[0].witnesses.map((w) =>
        locations.push({
          lng: h3ToGeo(w.location)[1],
          lat: h3ToGeo(w.location)[0],
        }),
      )
      locations.push({ lng: path[0].challengeeLon, lat: path[0].challengeeLat })
    } else {
      // before beaconing challenges
      path.map((p) => {
        // include all hotspots involved in the challenge
        locations.push({ lng: p?.challengeeLon, lat: p?.challengeeLat })
        // if witnesses are included, include them in finding the bounds
        if (showWitnesses)
          p.witnesses.map((w) =>
            locations.push({
              lng: h3ToGeo(w.location)[1],
              lat: h3ToGeo(w.location)[0],
            }),
          )
      })
    }
  }

  const mapBounds = findBounds(locations)

  const mapProps = {}
  if (locations.length == 1) {
    mapProps.center = [locations[0].lng, locations[0].lat]
    mapProps.zoom = [10]
  } else {
    mapProps.fitBounds = mapBounds
    mapProps.fitBoundsOptions = { padding: 100, animate: false }
  }

  if (pathHasLocations) {
    return (
      <Mapbox
        style="https://api.maptiler.com/maps/2469a8ae-f7e5-4ed1-b856-cd312538e33b/style.json?key=kNomjOqCRi7kEjO4HbFF"
        container="map"
        containerStyle={{
          height: '600px',
          width: '100%',
        }}
        movingMethod="jumpTo"
        {...mapProps}
      >
        {path.map((p, idx) => {
          return (
            <span key={`${p}-${idx}`}>
              <Tooltip title={animalHash(p.challengee)}>
                <Marker
                  key={p.challengee}
                  style={
                    p.receipt ||
                    p.witnesses.length > 0 ||
                    (path[idx + 1] &&
                      (path[idx + 1].receipt ||
                        path[idx + 1].witnesses.length > 0))
                      ? styles.gatewaySuccess
                      : styles.gatewayFailed
                  }
                  anchor="center"
                  coordinates={[
                    p.challengeeLon ? p.challengeeLon : 0,
                    p.challengeeLat ? p.challengeeLat : 0,
                  ]}
                  onClick={() => router.push(`/hotspots/${p.challengee}`)}
                >
                  <span style={{ color: 'white', fontSize: '8px' }}>
                    {idx + 1}
                  </span>
                </Marker>
              </Tooltip>
              <Layer
                key={'line-' + p.challengee}
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={
                  p.receipt ||
                  p.witnesses.length > 0 ||
                  (path[idx + 1] &&
                    (path[idx + 1].receipt ||
                      path[idx + 1].witnesses.length > 0))
                    ? styles.lineSuccess
                    : styles.lineFailure
                }
              >
                <Feature
                  coordinates={[
                    [
                      p.challengeeLon ? p.challengeeLon : 0,
                      p.challengeeLat ? p.challengeeLat : 0,
                    ],
                    path[idx + 1]
                      ? [
                          path[idx + 1].challengeeLon
                            ? path[idx + 1].challengeeLon
                            : 0,
                          path[idx + 1].challengeeLat
                            ? path[idx + 1].challengeeLat
                            : 0,
                        ]
                      : [false],
                  ]}
                />
              </Layer>
              {p.witnesses.length > 0 &&
                showWitnesses &&
                p.witnesses.map((w) => {
                  return (
                    <span>
                      <Tooltip title={animalHash(w.gateway)}>
                        <Marker
                          key={w.gateway}
                          style={
                            w.is_valid || w.isValid
                              ? styles.witnessMarkerValid
                              : styles.witnessMarkerInvalid
                          }
                          anchor="center"
                          coordinates={[
                            h3ToGeo(w.location)[1],
                            h3ToGeo(w.location)[0],
                          ]}
                          onClick={() => router.push(`/hotspots/${w.gateway}`)}
                        ></Marker>
                      </Tooltip>
                      <Layer
                        key={'line-' + w.address}
                        type="line"
                        layout={{
                          'line-cap': 'round',
                          'line-join': 'round',
                        }}
                        paint={
                          w.is_valid || w.isValid
                            ? styles.witnessLineValid
                            : styles.witnessLineInvalid
                        }
                      >
                        <Feature
                          coordinates={[
                            [h3ToGeo(w.location)[1], h3ToGeo(w.location)[0]],
                            [
                              p.challengeeLon ? p.challengeeLon : 0,
                              p.challengeeLat ? p.challengeeLat : 0,
                            ],
                          ]}
                        />
                      </Layer>
                    </span>
                  )
                })}
            </span>
          )
        })}
      </Mapbox>
    )
  } else return null
}

export default PocMapbox
