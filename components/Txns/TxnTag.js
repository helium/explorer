import React from 'react'
import { Tag as AntdTag, Tooltip } from 'antd'

const TxnTag = ({ type }) => typeTag(type)

export const COLORS = {
  state_channel_close_v1: 'teal',
  payment_v1: 'green',
  payment_v2: 'cyan',
  poc_request_v1: '#29D391',
  poc_receipts_v1: '#38A2FF',
  rewards_v1: '#E68B00',
  consensus_group_v1: '#FF6666',
  transfer_hotspot_v1: '#474DFF',
  poc_challengers: '#BE73FF',
  assert_location_v1: '#595a9a',
  add_gateway_v1: '#16CEE8',
  poc_witnesses: '#8597BB',
  securities: '#FFC769',
  default: 'blue',
}

const typeTag = (type) => {
  const Tag = ({ children }) => (
    <AntdTag color={COLORS[type]}>{children}</AntdTag>
  )

  switch (type) {
    case 'state_channel_close_v1':
      return <Tag>Packets Transferred</Tag>
    case 'payment_v1':
      return <Tag>Payment</Tag>
    case 'payment_v2':
      return <Tag>Payment</Tag>
    case 'poc_request_v1':
      return (
        <Tooltip placement="bottom" title="Proof of Coverage Challenge">
          <Tag>PoC Challenge</Tag>
        </Tooltip>
      )
    case 'poc_receipts_v1':
      return (
        <Tooltip placement="bottom" title="Proof of Coverage Receipt">
          <Tag>PoC Receipt</Tag>
        </Tooltip>
      )
    case 'rewards_v1':
      return (
        <Tooltip placement="bottom" title="Mining Reward">
          <Tag>Mining Reward</Tag>
        </Tooltip>
      )
    case 'consensus_group_v1':
      return (
        <Tooltip placement="bottom" title="Consensus Election">
          <Tag>Consensus Election</Tag>
        </Tooltip>
      )
    case 'transfer_hotspot_v1':
      return (
        <Tooltip
          placement="bottom"
          title="Hotspot Transfer Confirmation Transaction"
        >
          <Tag color="#474DFF">Transfer Hotspot</Tag>
        </Tooltip>
      )
    case 'poc_challengers':
      return (
        <Tooltip placement="bottom" title="Mining Reward for a PoC challenger">
          <Tag>PoC Challenger</Tag>
        </Tooltip>
      )
    case 'poc_challengees':
      return (
        <Tooltip placement="bottom" title="Mining Reward for a PoC challengee">
          <Tag>PoC Challengee</Tag>
        </Tooltip>
      )
    case 'assert_location_v1':
      return (
        <Tooltip placement="bottom" title="Assert Location Transaction">
          <Tag>Assert Location</Tag>
        </Tooltip>
      )
    case 'add_gateway_v1':
      return (
        <Tooltip placement="bottom" title="Add Gateway Transaction">
          <Tag>Add Hotspot</Tag>
        </Tooltip>
      )
    case 'poc_witnesses':
      return (
        <Tooltip placement="bottom" title="Mining Reward for a PoC witness">
          <Tag>PoC Witness</Tag>
        </Tooltip>
      )
    case 'securities':
      return (
        <Tooltip
          placement="bottom"
          title="Mining Reward for Security Token holders"
        >
          <Tag>Security Token Reward</Tag>
        </Tooltip>
      )
    case 'token_burn_v1':
      return <Tag color="#E86161">Token Burn</Tag>
    default:
      return <Tag>{type}</Tag>
  }
}

export default TxnTag
