import React from 'react'
import { capitalize } from 'lodash'
import Pill from '../Common/Pill'

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

const ValidatorStatusPill = ({
  status: { online, listen_addrs, height } = {
    online: null,
    listen_addrs: null,
    height: null,
  },
}) => {
  const status = getStatus(online, listen_addrs)

  return (
    <Pill
      title={capitalize(status)}
      tooltip={tooltipTitle[status]}
      color={circleColor[status]}
    />
  )
}

export default ValidatorStatusPill
