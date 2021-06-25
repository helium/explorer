import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'antd'
import { getStatus, statusCircleColor } from './utils'

const tooltipTitle = {
  relay:
    'Validators operating behind a relay are not directly reachable and may degrade consensus performance',
  online: 'Validator is online',
  offline: 'Validator is offline',
}

const ValidatorStatusDot = ({
  status: { online, listen_addrs, height } = {
    online: null,
    listen_addrs: null,
    height: null,
  },
}) => {
  const status = getStatus(online, listen_addrs)
  const color = statusCircleColor[status]
  return (
    <Tooltip title={tooltipTitle[status]}>
      <div
        className={classNames('w-2.5 h-2.5 rounded-full', {
          'bg-green-500': color === 'green',
          'bg-gray-550': color === 'gray',
          'bg-yellow-500': color === 'yellow',
        })}
      />
    </Tooltip>
  )
}

export default ValidatorStatusDot
