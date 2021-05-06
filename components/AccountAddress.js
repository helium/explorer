import React from 'react'
import { Tooltip } from 'antd'
import { isInteger } from 'lodash'

const AccountAddress = ({ address, truncate = false }) => {
  const truncateAmount = isInteger(truncate) ? truncate : 10
  return (
    <Tooltip title={address}>
      <span
        style={{
          cursor: 'pointer',
          fontFamily:
            "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;'",
        }}
      >
        {truncate
          ? `${address.slice(0, truncateAmount)}...${address.slice(
              -truncateAmount,
            )}`
          : address}
      </span>
    </Tooltip>
  )
}

export default AccountAddress
