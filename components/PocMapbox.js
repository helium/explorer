import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import { h3ToGeo } from 'h3-js'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
})

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
  return (
    <Mapbox
      style={`mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk`}
      container="map"
      center={[
        path[0].challengee_lon
          ? path[0].challengee_lon
          : path[0].challengeeLon
          ? path[0].challengeeLon
          : 0,
        path[0].challengee_lat
          ? path[0].challengee_lat
          : path[0].challengeeLat
          ? path[0].challengeeLat
          : 0,
      ]}
      containerStyle={{
        height: '600px',
        width: '100%',
      }}
      zoom={[11]}
      movingMethod="jumpTo"
    >
      {path.map((p, idx) => {
        return (
          <span key={`${p}-${idx}`}>
            <Marker
              key={p.challengee}
              style={
                p.receipt ||
                p.witnesses.length > 0 ||
                (path[idx + 1] &&
                  (path[idx + 1].receipt || path[idx + 1].witnesses.length > 0))
                  ? styles.gatewaySuccess
                  : styles.gatewayFailed
              }
              anchor="center"
              coordinates={[
                p.challengee_lon
                  ? p.challengee_lon
                  : p.challengeeLon
                  ? p.challengeeLon
                  : 0,
                p.challengee_lat
                  ? p.challengee_lat
                  : p.challengeeLat
                  ? p.challengeeLat
                  : 0,
              ]}
            >
              <span style={{ color: 'white', fontSize: '8px' }}>{idx + 1}</span>
            </Marker>
            <Layer
              key={'line-' + p.challengee}
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={
                p.receipt ||
                p.witnesses.length > 0 ||
                (path[idx + 1] &&
                  (path[idx + 1].receipt || path[idx + 1].witnesses.length > 0))
                  ? styles.lineSuccess
                  : styles.lineFailure
              }
            >
              <Feature
                coordinates={[
                  [
                    p.challengee_lon
                      ? p.challengee_lon
                      : p.challengeeLon
                      ? p.challengeeLon
                      : 0,
                    p.challengee_lat
                      ? p.challengee_lat
                      : p.challengeeLat
                      ? p.challengeeLat
                      : 0,
                  ],
                  path[idx + 1]
                    ? [
                        path[idx + 1].challengee_lon
                          ? path[idx + 1].challengee_lon
                          : path[idx + 1].challengeeLon
                          ? path[idx + 1].challengeeLon
                          : 0,
                        path[idx + 1].challengee_lat
                          ? path[idx + 1].challengee_lat
                          : path[idx + 1].challengeeLat
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
                    <Marker
                      key={w.address}
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
                    ></Marker>
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
                            p.challengee_lon
                              ? p.challengee_lon
                              : p.challengeeLon
                              ? p.challengeeLon
                              : 0,
                            p.challengee_lat
                              ? p.challengee_lat
                              : p.challengeeLat
                              ? p.challengeeLat
                              : 0,
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
}
export default PocMapbox
