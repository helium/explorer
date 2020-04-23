import React, { Component } from 'react'
import { Tag, Icon } from 'antd';

const TxnTag = ({ type }) => (
  typeTag(type)
)

const typeTag = (type) => {
    switch(type) {
      case "payment_v1":
        return <Tag color="green">Payment</Tag>
        case "payment_v2":
          return <Tag color="cyan">Payment</Tag>
      case "poc_request_v1":
        return <Tag color="#BE73FF">PoC Challenge</Tag>
      case "poc_receipts_v1":
        return <Tag color="#29D391">PoC Receipt</Tag>
      case "rewards_v1":
        return <Tag color="#9B9B9B">Mining Reward</Tag>
      case "consensus_group_v1":
        return <Tag color="#BE73FF">Consensus Election</Tag>
      case "poc_challengers":
        return <Tag color="#218BE8">PoC Challenger</Tag>
      case "poc_challengees":
        return <Tag color="#0F6FC3">PoC Challengee</Tag>
      case "poc_witnesses":
        return <Tag color="#FFC769">PoC Witness</Tag>
      case "securities":
        return <Tag color="#D9A54F">Security Token Reward</Tag>
      default:
        return <Tag color="blue">{type}</Tag>
    }
  }

export default TxnTag
