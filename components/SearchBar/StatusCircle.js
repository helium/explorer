import React from 'react'
import { Tooltip } from 'antd'

const StatusCircle = ({ online = true }) => (
  <Tooltip title={online ? 'Hotspot online' : 'Hotspot offline'}>
    <span
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '10px',
        background: online ? '#29D391' : '#FFC769',
        display: 'inline-block',
        marginRight: '6px',
      }}
    />
  </Tooltip>
)

export default StatusCircle
