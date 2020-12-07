import React from 'react'
import ReactMapboxGl from 'react-mapbox-gl'

const Mapbox = ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_KEY,
  interactive: false,
  touchZoomRotate: false,
  maxZoom: 14,
  minZoom: 0,
})

class MiniCoverageMap extends React.Component {
  state = {
    zoom: [3],
  }

  render() {
    const { zoomLevel, style } = this.props

    return (
      <span className="mini-coverage-map">
        <p className="mini-coverage-map-interactive-text unselectable-text">
          Click to open full-screen interactive map
        </p>
        <span className="mini-coverage-map-overlay" />
        <Mapbox
          style="mapbox://styles/petermain/ckhtuzof73dpe19nydccv3zma"
          containerStyle={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          zoom={[zoomLevel]}
        />
      </span>
    )
  }
}

export default MiniCoverageMap
