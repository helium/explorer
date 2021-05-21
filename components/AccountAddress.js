import React from 'react'
import { Tooltip } from 'antd'
import { isInteger } from 'lodash'

const AccountAddress = ({ address, truncate = false, tooltip }) => {
  const truncateAmount = isInteger(truncate) ? truncate : 10
  const inner = (
    <span
      className="break-all"
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
  )

  if (tooltip) return <Tooltip title={address}>{inner}</Tooltip>

  return inner
}

export default AccountAddress
