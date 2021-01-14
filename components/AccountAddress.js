import React from 'react'
import { Tooltip } from 'antd'

const AccountAddress = ({ address, truncate = false }) => {
  return (
    <Tooltip title={address}>
      <span
        style={{
          cursor: 'pointer',
          fontFamily:
            "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;'",
        }}
      >
        {truncate ? `${address.slice(0, 10)}...${address.slice(-10)}` : address}
      </span>
    </Tooltip>
  )
}

export default AccountAddress
