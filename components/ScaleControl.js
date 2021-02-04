import React from 'react'
import { ScaleControl as BaseScaleControl } from 'react-mapbox-gl'

class ScaleControl extends React.Component {
  render() {
    return (
      <BaseScaleControl
        style={{
          backgroundColor: '#263441',
          borderRadius: 3,
        }}
      />
    )
  }
}

export default ScaleControl
