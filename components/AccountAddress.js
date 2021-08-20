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
        {truncate ? (
          <span>
            {address.slice(0, truncateAmount)}
            <span className="text-gray-525 px-0.5 tracking-wide">...</span>
            {showSecondHalf && <span>{address.slice(-truncateAmount)}</span>}
          </span>
        ) : (
          address
        )}
      </span>
    </Tooltip>
  )
}

export default AccountAddress
