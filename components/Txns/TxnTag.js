import React from 'react'
import { Tag, Tooltip } from 'antd'

const CONFIG = {
  state_channel_close_v1: { color: 'teal', name: 'Packets Transferred' },
  payment_v1: { color: 'green', name: 'Payment' },
  payment_v2: { color: 'cyan', name: 'Payment' },
  poc_request_v1: {
    color: '#29D391',
    name: 'PoC Challenge',
    tooltip: 'Proof of Coverage Challenge',
  },
  poc_receipts_v1: {
    color: '#38A2FF',
    name: 'PoC Receipt',
    tooltip: 'Proof of Coverage Receipt',
  },
  rewards_v1: {
    color: '#E68B00',
    name: 'Mining Reward',
    tooltip: 'Mining Reward',
  },
  consensus_group_v1: {
    color: '#FF6666',
    name: 'Consensus Election',
    tooltip: 'Consensus Election',
  },
  transfer_hotspot_v1: {
    color: '#474DFF',
    name: 'Transfer Hotspot',
    tooltip: 'Hotspot Transfer Confirmation Transaction',
  },
  poc_challengers: {
    color: '#BE73FF',
    name: 'PoC Challenger',
    tooltip: 'Mining Reward for a PoC challenger',
  },
  poc_challengees: {
    color: '#595A9A',
    name: 'PoC Challengee',
    tooltip: 'Mining Reward for a PoC challengee',
  },
  assert_location_v1: {
    color: '#16CEE8',
    name: 'Assert Location',
    tooltip: 'Assert Location Transaction',
  },
  add_gateway_v1: {
    color: '#8597BB',
    name: 'Add Hotspot',
    tooltip: 'Add Gateway Transaction',
  },
  poc_witnesses: {
    color: '#FFC769',
    name: 'PoC Witness',
    tooltip: 'Mining Reward for a PoC witness',
  },
  securities: {
    color: '#9AE8C9',
    name: 'Security Token Reward',
    tooltip: 'Mining Reward for Security Token holders',
  },
  token_burn_v1: { color: '#E86161', name: 'Token Burn' },
  default: { color: 'blue' },
}

export const getName = (id) => {
  return CONFIG[id]?.name || id
}

export const getColor = (id) => {
  return (CONFIG[id] || CONFIG.default).color
}

export const getTooltip = (id) => {
  return CONFIG[id]?.tooltip
}

const TxnTag = ({ type }) => {
  const tag = <Tag color={getColor(type)}>{getName(type)}</Tag>
  const tooltip = getTooltip(type)

  return tooltip ? (
    <Tooltip placement="bottom" title={tooltip}>
      {tag}
    </Tooltip>
  ) : (
    tag
  )
}

export default TxnTag
