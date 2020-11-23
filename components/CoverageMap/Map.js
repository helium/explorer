import React from 'react'
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer } from 'react-mapbox-gl'
import { LngLatBounds } from 'mapbox-gl'
import { colors } from '../theme'
import geoJSON from 'geojson'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: true,
  touchZoomRotate: true,
  maxZoom: 14,
  minZoom: 3,
})

// return array of coordinates
const makeFitBounds = (activePath, showDetails) => {
  if (showDetails) {
    const fitBounds = new LngLatBounds()
    activePath.targets.forEach((target) => fitBounds.extend(target.coordinates))
    activePath.witnesses.forEach((witness) => fitBounds.extend(witness))
    return fitBounds
  } else if (activePath) {
    return [
      activePath.challenger.coordinates,
      activePath.targets[activePath.targets.length - 1].coordinates,
    ]
  } else {
    return null
  }
}

export default class Map extends React.Component {
  state = {
    map: null,
    center: [-122.41, 37.77],
    zoom: [5],
    fitBounds: makeFitBounds(this.props.activePath, this.props.showDetails),
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    if (nextProps.showDetails !== prevProps.showDetails) {
      return {
        fitBounds: makeFitBounds(nextProps.activePath, nextProps.showDetails),
      }
    } else {
      return null
    }
  }

  render() {
    const {
      showDetails,
      activePath,
      toggleDetails,
      paths,
      toggleActivePath,
    } = this.props
    const inactivePaths = activePath
      ? paths.filter((path) => path.id !== activePath.id)
      : paths

    const targets = activePath ? activePath.targets : []
    const witnesses = activePath ? activePath.witnesses : []
    const linePairs = showDetails
      ? targets.reduce((result, value, index, array) => {
          const nextValue = array[index + 1]
          if (nextValue) {
            return result.concat([[value.coordinates, nextValue.coordinates]])
          } else {
            return result
          }
        }, [])
      : null

    const witnessData = geoJSON.parse(witnesses, { Point: ['lat', 'lng'] })
    console.log(witnesses)
    console.log(witnessData)

    const primaryGreenLayer = {
      'icon-image': 'primaryGreenIcon',
      'icon-allow-overlap': true,
    }
    const primaryGreenImage = new Image(26, 30)
    primaryGreenImage.src = '/static/img/hex-primary-green.png'
    const primaryGreen = ['primaryGreenIcon', primaryGreenImage]

    const primaryRedLayer = {
      'icon-image': 'primaryRedIcon',
      'icon-allow-overlap': true,
    }
    const primaryRedImage = new Image(26, 30)
    primaryRedImage.src = '/static/img/hex-primary-red.png'
    const primaryRed = ['primaryRedIcon', primaryRedImage]

    const grayLayer = { 'icon-image': 'grayIcon', 'icon-allow-overlap': true }
    const grayImage = new Image(13, 15)
    grayImage.src = '/static/img/hex-gray.png'
    const gray = ['grayIcon', grayImage]

    const grayOverviewLayer = {
      'icon-image': 'grayOverviewIcon',
      'icon-allow-overlap': true,
    }
    const grayOverviewImage = new Image(13, 15)
    grayOverviewImage.src = '/static/img/hex-gray.png'
    const grayOverview = ['grayOverviewIcon', grayOverviewImage]

    const purpleLayer = {
      'icon-image': 'purpleIcon',
      'icon-allow-overlap': true,
    }
    const purpleImage = new Image(13, 15)
    purpleImage.src = '/static/img/hex-purple.png'
    const purple = ['purpleIcon', purpleImage]

    const successLayer = {
      'icon-image': 'successIcon',
      'icon-allow-overlap': true,
    }
    const successImage = new Image(35, 41)
    successImage.src = '/static/img/target-success.png'
    const success = ['successIcon', successImage]

    const failureLayer = {
      'icon-image': 'failureIcon',
      'icon-allow-overlap': true,
    }
    const failureImage = new Image(35, 41)
    failureImage.src = '/static/img/target-failure.png'
    const failure = ['failureIcon', failureImage]

    const untestedLayer = {
      'icon-image': 'untestedIcon',
      'icon-allow-overlap': true,
    }
    const untestedImage = new Image(35, 41)
    untestedImage.src = '/static/img/target-untested.png'
    const untested = ['untestedIcon', untestedImage]

    return (
      <Mapbox
        style="mapbox://styles/petermain/cjsdsbmjb1h7c1grzv4clr7y7"
        containerStyle={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'visible',
        }}
        center={this.state.center}
        zoom={this.state.zoom}
        fitBounds={this.state.fitBounds}
        fitBoundsOptions={{
          padding: 200,
          offset: [200, 0],
          duration: 1500,
        }}
        onStyleLoad={(map) => {
          this.setState({ map })
        }}
      >
        {/* details witnesses */}
        <GeoJSONLayer
          id="witnesses"
          data={witnessData}
          sourceOptions={{
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 1, // Radius of each cluster when clustering points (defaults to 50)
          }}
          circlePaint={{
            // 'circle-radius': 4,
            // 'circle-radius': ['*', 4, ['get', 'point_count']],
            // 'circle-radius': {
            //   'base': 1,
            //   'stops': [[3, 2], [14, 4]]
            // },
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              // when zoom is 0, set each feature's circle radius to the value of its "rating" property
              3,
              4,
              8,
              4,
              // when zoom is 10, set each feature's circle radius to four times the value of its "rating" property
              14,
              ['*', 4, ['get', 'point_count']],
            ],
            'circle-color': colors.yellow,
          }}
        />

        {/* overview inactive */}
        <Layer
          type="symbol"
          id="overviewInactiveChallenger"
          layout={grayOverviewLayer}
          images={grayOverview}
        >
          {!showDetails &&
            !activePath &&
            paths &&
            inactivePaths.map((path) => (
              <Feature
                key={path.challenger.address}
                coordinates={path.challenger.coordinates}
                onClick={() => toggleActivePath(path)}
                onMouseEnter={() =>
                  (this.state.map.getCanvas().style.cursor = 'pointer')
                }
                onMouseLeave={() =>
                  (this.state.map.getCanvas().style.cursor = '')
                }
              />
            ))}
        </Layer>

        <Layer
          type="symbol"
          id="overviewInactiveTarget"
          layout={grayLayer}
          images={gray}
        >
          {!showDetails &&
            !activePath &&
            paths &&
            inactivePaths.map((path) => (
              <Feature
                key={path.targets[path.targets.length - 1].address}
                coordinates={path.targets[path.targets.length - 1].coordinates}
                onClick={() => toggleActivePath(path)}
                onMouseEnter={() =>
                  (this.state.map.getCanvas().style.cursor = 'pointer')
                }
                onMouseLeave={() =>
                  (this.state.map.getCanvas().style.cursor = '')
                }
              />
            ))}
        </Layer>

        {/* overview challenger-target line */}
        <Layer
          type="line"
          paint={{
            'line-color': colors.purple,
            'line-width': 2.5,
            'line-dasharray': [2, 2],
          }}
        >
          {!showDetails && activePath && (
            <Feature
              key={`overview-line-${activePath.id}`}
              coordinates={[
                activePath.challenger.coordinates,
                activePath.targets[activePath.targets.length - 1].coordinates,
              ]}
              onMouseEnter={() =>
                (this.state.map.getCanvas().style.cursor = 'pointer')
              }
              onMouseLeave={() =>
                (this.state.map.getCanvas().style.cursor = '')
              }
            />
          )}
        </Layer>

        {/* challenger */}
        <Layer
          type="symbol"
          id="challenger"
          layout={purpleLayer}
          images={purple}
        >
          {activePath && (
            <Feature
              key={`challenger-${activePath.id}`}
              coordinates={activePath.challenger.coordinates}
              onMouseEnter={() =>
                (this.state.map.getCanvas().style.cursor = 'pointer')
              }
              onMouseLeave={() =>
                (this.state.map.getCanvas().style.cursor = '')
              }
            />
          )}
        </Layer>

        {/* overview success target */}
        <Layer
          type="symbol"
          id="overviewSuccessTarget"
          layout={primaryGreenLayer}
          images={primaryGreen}
        >
          {!showDetails &&
            activePath &&
            activePath.targets[activePath.targets.length - 1].status ===
              'success' && (
              <Feature
                key={`overview-success-target-${activePath.id}`}
                coordinates={
                  activePath &&
                  activePath.targets[activePath.targets.length - 1].coordinates
                }
                onMouseEnter={() =>
                  (this.state.map.getCanvas().style.cursor = 'pointer')
                }
                onMouseLeave={() =>
                  (this.state.map.getCanvas().style.cursor = '')
                }
              />
            )}
        </Layer>

        {/* overview failure target */}
        <Layer
          type="symbol"
          id="overviewFailureTarget"
          layout={primaryRedLayer}
          images={primaryRed}
        >
          {!showDetails &&
            activePath &&
            activePath.targets[activePath.targets.length - 1].status !==
              'success' && (
              <Feature
                key={`overview-failure-target-${activePath.id}`}
                coordinates={
                  activePath &&
                  activePath.targets[activePath.targets.length - 1].coordinates
                }
                onMouseEnter={() =>
                  (this.state.map.getCanvas().style.cursor = 'pointer')
                }
                onMouseLeave={() =>
                  (this.state.map.getCanvas().style.cursor = '')
                }
              />
            )}
        </Layer>

        {/* details line from challenger */}
        <Layer
          type="line"
          paint={{
            'line-color': colors.purple,
            'line-width': 2.5,
            'line-dasharray': [2, 2],
          }}
        >
          {showDetails && activePath && (
            <Feature
              key={`detail-line-${activePath.id}`}
              coordinates={[
                activePath.challenger.coordinates,
                activePath.targets[0].coordinates,
              ]}
              onMouseEnter={() =>
                (this.state.map.getCanvas().style.cursor = 'pointer')
              }
              onMouseLeave={() =>
                (this.state.map.getCanvas().style.cursor = '')
              }
            />
          )}
        </Layer>

        {/* details untested lines*/}
        <Layer
          type="line"
          paint={{
            'line-color': colors.gray,
            'line-width': 2.5,
            'line-dasharray': [2, 2],
          }}
        >
          {showDetails &&
            activePath &&
            targets.map((target, i) =>
              target.status === 'untested' && targets[i + 1] ? (
                <Feature
                  key={`details-untested-target-${target.address}`}
                  coordinates={[target.coordinates, targets[i + 1].coordinates]}
                  onMouseEnter={() =>
                    (this.state.map.getCanvas().style.cursor = 'pointer')
                  }
                  onMouseLeave={() =>
                    (this.state.map.getCanvas().style.cursor = '')
                  }
                />
              ) : (
                <Feature
                  key={`details-untested-target-${target.address}`}
                  coordinates={[target.coordinates, target.coordinates]}
                />
              ),
            )}
        </Layer>

        {/* details success lines */}
        <Layer
          type="line"
          paint={{
            'line-color': colors.green,
            'line-width': 2.5,
            'line-dasharray': [2, 2],
          }}
        >
          {showDetails &&
            activePath &&
            targets.map((target, i) =>
              target.status === 'success' && targets[i + 1] ? (
                <Feature
                  key={`details-success-target-${target.address}`}
                  coordinates={[target.coordinates, targets[i + 1].coordinates]}
                  onMouseEnter={() =>
                    (this.state.map.getCanvas().style.cursor = 'pointer')
                  }
                  onMouseLeave={() =>
                    (this.state.map.getCanvas().style.cursor = '')
                  }
                />
              ) : (
                <Feature
                  key={`details-success-target-${target.address}`}
                  coordinates={[target.coordinates, target.coordinates]}
                />
              ),
            )}
        </Layer>

        {/* details failure lines */}
        <Layer
          type="line"
          paint={{
            'line-color': colors.red,
            'line-width': 2.5,
            'line-dasharray': [2, 2],
          }}
        >
          {showDetails &&
            activePath &&
            targets.map((target, i) =>
              target.status === 'failure' && targets[i + 1] ? (
                <Feature
                  key={`details-failure-target-${target.address}`}
                  coordinates={[target.coordinates, targets[i + 1].coordinates]}
                  onMouseEnter={() =>
                    (this.state.map.getCanvas().style.cursor = 'pointer')
                  }
                  onMouseLeave={() =>
                    (this.state.map.getCanvas().style.cursor = '')
                  }
                />
              ) : (
                <Feature
                  key={`details-failure-target-${target.address}`}
                  coordinates={[target.coordinates, target.coordinates]}
                />
              ),
            )}
        </Layer>

        {/* details untested targets*/}
        <Layer
          type="symbol"
          id="untestedTarget"
          layout={untestedLayer}
          images={untested}
        >
          {showDetails &&
            activePath &&
            targets
              .filter((t) => t.status === 'untested')
              .map((target) => (
                <Feature
                  key={`details-untested-target-${target.address}`}
                  coordinates={target.coordinates}
                />
              ))}
        </Layer>

        {/* details success targets */}
        <Layer
          type="symbol"
          id="successTarget"
          layout={successLayer}
          images={success}
        >
          {showDetails &&
            activePath &&
            targets
              .filter((t) => t.status === 'success')
              .map((target) => (
                <Feature
                  key={`details-success-target-${target.address}`}
                  coordinates={target.coordinates}
                />
              ))}
        </Layer>

        {/* details failure targets */}
        <Layer
          type="symbol"
          id="failureTarget"
          layout={failureLayer}
          images={failure}
        >
          {showDetails &&
            activePath &&
            targets
              .filter((t) => t.status === 'failure')
              .map((target) => (
                <Feature
                  key={`details-failure-target-${target.address}`}
                  coordinates={target.coordinates}
                />
              ))}
        </Layer>
      </Mapbox>
    )
  }
}
