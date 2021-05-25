import React from 'react'
import { Tooltip } from 'antd'
import { isInteger } from 'lodash'
import classNames from 'classnames'

const AccountAddress = ({ address, truncate = false, tooltip, mono }) => {
  const truncateAmount = isInteger(truncate) ? truncate : 10
  return (
    <Tooltip title={tooltip}>
      <span
        className={classNames('break-all cursor-pointer', {
          'font-mono': mono,
        })}
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
