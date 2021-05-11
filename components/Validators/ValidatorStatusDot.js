import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'antd'

function isRelay(listen_addrs) {
  return !!(
    listen_addrs &&
    listen_addrs.length > 0 &&
    listen_addrs[0].match('p2p-circuit')
  )
}

const circleColor = {
  relay: 'yellow',
  online: 'green',
  offline: 'gray',
}

const tooltipTitle = {
  relay:
    'Validators operating behind a relay are not directly reachable and may degrade consensus performance',
  online: 'Validator is online',
  offline: 'Validator is offline',
}

function getStatus(online, listen_addrs) {
  if (isRelay(listen_addrs)) return 'relay'
  return online
}

const ValidatorStatusDot = ({
  status: { online, listen_addrs, height } = {
    online: null,
    listen_addrs: null,
    height: null,
  },
}) => {
  const status = getStatus(online, listen_addrs)
  const color = circleColor[status]
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
