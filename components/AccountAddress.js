import React from 'react'
import { Tooltip } from 'antd'
import { isInteger } from 'lodash'
import classNames from 'classnames'
import Skeleton from './Common/Skeleton'

const AccountAddress = ({
  address,
  truncate = false,
  tooltip,
  mono,
  showSecondHalf = true,
  classes,
}) => {
  const truncateAmount = isInteger(truncate) ? truncate : 10
  if (!address) return <Skeleton />
  return (
    <Tooltip title={tooltip}>
      <span
        className={classNames('break-all cursor-pointer', classes, {
          'font-mono': mono,
        })}
      >
        {truncate
          ? `${address.slice(0, truncateAmount)}...${
              showSecondHalf ? address.slice(-truncateAmount) : ''
            }`
          : address}
      </span>
    </Tooltip>
  )
}

export default AccountAddress
