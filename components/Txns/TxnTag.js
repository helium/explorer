import React from 'react'
import { Tag, Tooltip } from 'antd'

const TxnTag = ({ type }) => typeTag(type)

const typeTag = (type) => {
  switch (type) {
    case 'state_channel_close_v1':
      return <Tag color="teal">Packets Transferred</Tag>
    case 'payment_v1':
      return <Tag color="green">Payment</Tag>
    case 'payment_v2':
      return <Tag color="cyan">Payment</Tag>
    case 'poc_request_v1':
      return (
        <Tooltip placement="bottom" title="Proof of Coverage Challenge">
          <Tag color="#29D391">PoC Challenge</Tag>
        </Tooltip>
      )
    case 'poc_receipts_v1':
      return (
        <Tooltip placement="bottom" title="Proof of Coverage Receipt">
          <Tag color="#38A2FF">PoC Receipt</Tag>
        </Tooltip>
      )
    case 'rewards_v1':
      return (
        <Tooltip placement="bottom" title="Mining Reward">
          <Tag color="#E68B00">Mining Reward</Tag>
        </Tooltip>
      )
    case 'consensus_group_v1':
      return (
        <Tooltip placement="bottom" title="Consensus Election">
          <Tag color="#FF6666">Consensus Election</Tag>
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
          <Tag color="#BE73FF">PoC Challenger</Tag>
        </Tooltip>
      )
    case 'poc_challengees':
      return (
        <Tooltip placement="bottom" title="Mining Reward for a PoC challengee">
          <Tag color="#595a9a">PoC Challengee</Tag>
        </Tooltip>
      )
    case 'assert_location_v1':
      return (
        <Tooltip placement="bottom" title="Assert Location Transaction">
          <Tag color="#16CEE8">Assert Location</Tag>
        </Tooltip>
      )
    case 'add_gateway_v1':
      return (
        <Tooltip placement="bottom" title="Add Gateway Transaction">
          <Tag color="#8597BB">Add Hotspot</Tag>
        </Tooltip>
      )
    case 'poc_witnesses':
      return (
        <Tooltip placement="bottom" title="Mining Reward for a PoC witness">
          <Tag color="#FFC769">PoC Witness</Tag>
        </Tooltip>
      )
    case 'securities':
      return (
        <Tooltip
          placement="bottom"
          title="Mining Reward for Security Token holders"
        >
          <Tag color="#9AE8C9">Security Token Reward</Tag>
        </Tooltip>
      )
    case 'token_burn_v1':
      return <Tag color="#E86161">Token Burn</Tag>
    default:
      return <Tag color="blue">{type}</Tag>
  }
}

export default TxnTag
