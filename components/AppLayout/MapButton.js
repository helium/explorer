import React, { Component } from 'react'
import { Tooltip } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import Link from 'next/link'

class MapButton extends Component {
  render() {
    return (
      <Tooltip placement="bottomRight" title="View Interactive Coverage Map">
        <Link href="/coverage">
          <a
            className="map-button"
            style={{
              textAlign: 'center',
              lineHeight: 1.5715,
            }}
          >
            <GlobalOutlined
              style={{
                marginRight: 10,
                position: 'relative',
                fontSize: 23,
              }}
            />
            <span className="map-button-text">Coverage Map</span>
          </a>
        </Link>
      </Tooltip>
    )
  }
}

export default MapButton
