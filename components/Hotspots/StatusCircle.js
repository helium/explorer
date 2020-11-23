import React from 'react'
import { Tooltip } from 'antd'

function tooltipTitle(status, height) {
  let title = status === 'online' ? 'Hotspot online' : 'Hotspot offline'

  if (height) {
    title = title += ` as of block ${height.toLocaleString()}`
  }

  return title
}

const StatusCircle = ({
  status: { online: status, height } = { online: null, height: null },
}) => (
  <Tooltip title={tooltipTitle(status, height)}>
    <span
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '10px',
        background: status === 'online' ? '#29D391' : '#FFC769',
        display: 'inline-block',
        marginRight: '6px',
      }}
    />
  </Tooltip>
)

export default StatusCircle
