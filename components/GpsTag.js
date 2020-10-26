import React, { Component } from 'react'
import { Tag, Icon, Tooltip } from 'antd'

const GpsTag = ({ type }) => typeTag(type)

const typeTag = (type) => {
  console.log(type)
  if (type && type.gps) {
    switch (type.gps) {
      case 'bad_assert':
        return (
          <Tooltip
            placement="bottom"
            title="The GPS location of this Hotspot does not match its claimed location on the blockchain."
          >
            <h3
              style={{
                color: 'white',
                background: 'red',
                padding: '1px 6px',
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 600,
                display: 'inline-block',
                letterSpacing: -0.5,
                marginLeft: '5px',
              }}
            >
              Bad GPS Location
            </h3>
          </Tooltip>
        )
      case 'no_fix':
        return (
          <Tooltip
            placement="bottom"
            title="This Hotspot has no GPS location information available."
          >
            <h3
              style={{
                color: 'white',
                background: 'orange',
                padding: '1px 6px',
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 600,
                display: 'inline-block',
                letterSpacing: -0.5,
                marginLeft: '5px',
              }}
            >
              No GPS fix
            </h3>
          </Tooltip>
        )
      case 'good_fix':
        return (
          <Tooltip
            placement="bottom"
            title="The GPS location of this Hotspot matches its claimed location on the blockchain."
          >
            <h3
              style={{
                color: 'white',
                background: 'green',
                padding: '1px 6px',
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 600,
                display: 'inline-block',
                letterSpacing: -0.5,
                marginLeft: '5px',
              }}
            >
              Good GPS Location
            </h3>
          </Tooltip>
        )
      default:
        return <span></span>
    }
  } else {
    return <span></span>
  }
}

export default GpsTag
