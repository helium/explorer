import React from 'react'
import { Tooltip } from 'antd'
import { isInteger } from 'lodash'
import classNames from 'classnames'

const AccountAddress = ({ address, truncate = false, tooltip, mono }) => {
  const truncateAmount = isInteger(truncate) ? truncate : 10
  const inner = (
    <span
      className={classNames('break-all cursor-pointer', { 'font-mono': mono })}
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
