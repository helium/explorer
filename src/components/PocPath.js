import React, { Component } from 'react'
import { Checkbox } from 'antd'
import { h3ToGeo } from 'h3-js'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
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
  witnessMarker: {
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
    opacity: 0.3,
  },
  lineSuccess: {
    'line-color': '#09B851',
    'line-width': 2,
  },
  lineFailure: {
    'line-color': '#CA0926',
    'line-width': 2,
  },
}

const initialState = {
  loading: true,
  loadingInitial: true,
  showWitnesses: false,
}

class PocPath extends Component {
  state = initialState

  async componentDidMount() {
    this.setState({ loadingInitial: false })
  }

  toggleWitnesses = (e) => {
    this.setState({
      showWitnesses: e.target.checked,
    })
  }

  render() {
    const { loadingInitial, showWitnesses } = this.state
    const { path } = this.props

    if (!loadingInitial) {
      return (
        <span>
          <Mapbox
            style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
            container="map"
            center={[
              path[0].challengee_lon ? path[0].challengee_lon : 0,
              path[0].challengee_lat ? path[0].challengee_lat : 0,
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
                <span>
                  <Marker
                    key={p.challengee}
                    style={
                      p.receipt ? styles.gatewaySuccess : styles.gatewayFailed
                    }
                    anchor="center"
                    coordinates={[p.challengee_lon, p.challengee_lat]}
                    onClick={console.log(p.challengee)}
                  />
                  <Layer
                    key={'line-' + p.challengee}
                    type="line"
                    layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                    paint={
                      path[idx + 1] && path[idx + 1].receipt
                        ? styles.lineSuccess
                        : styles.lineFailure
                    }
                  >
                    <Feature
                      coordinates={[
                        [p.challengee_lon, p.challengee_lat],
                        path[idx + 1]
                          ? [
                              path[idx + 1].challengee_lon,
                              path[idx + 1].challengee_lat,
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
                            style={styles.witnessMarker}
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
                            paint={{
                              'line-color': '#F1C40F',
                              'line-width': 2,
                              'line-opacity': 0.3,
                            }}
                          >
                            <Feature
                              coordinates={[
                                [
                                  h3ToGeo(w.location)[1],
                                  h3ToGeo(w.location)[0],
                                ],
                                [p.challengee_lon, p.challengee_lat],
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
          <Checkbox
            onChange={this.toggleWitnesses}
            style={{ color: 'black', float: 'right' }}
          >
            Show witnesses
          </Checkbox>
        </span>
      )
    } else {
      return <div>loading</div>
    }
  }
}

export default PocPath
