import React from 'react'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl'
import fetch from 'node-fetch'
import { Button } from 'antd'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: false,
  touchZoomRotate: false,
  maxZoom: 14,
  minZoom: 0,
})

const circleLayout = {
  'circle-color': '#29d391',
  'circle-radius': 3,
  'circle-opacity': 0.9,
  'circle-blur': 5,
}

class MiniCoverageMap extends React.Component {
  state = {
    zoom: [3],
    coverage: null,
  }

  async componentDidMount() {
    const response = await fetch('/api/coverage')
    const coverage = await response.json()
    this.setState({ coverage })
  }

  render() {
    const { coverage } = this.state

    return (
      <span className="mini-coverage-map">
        <p className="mini-coverage-map-interactive-text unselectable-text">
          Open full-screen interactive map
        </p>
        <span className="mini-coverage-map-overlay"></span>
        <Mapbox
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          containerStyle={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          fitBounds={[
            [164.63912, 9.751857],
            [-166.658409, 69.818137],
          ]}
          fitBoundsOptions={{
            padding: 50,
            animate: false,
          }}
        >
          {coverage && (
            <GeoJSONLayer
              id="coverage"
              data={coverage}
              circlePaint={circleLayout}
            />
          )}
        </Mapbox>
      </span>
    )
  }
}

export default MiniCoverageMap
