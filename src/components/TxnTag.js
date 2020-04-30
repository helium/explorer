import React, { Component } from 'react'
import { Tag, Icon, Tooltip } from 'antd';


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
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#29D391">PoC Challenge</Tag></Tooltip>
      case "poc_receipts_v1":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#38A2FF">PoC Receipt</Tag></Tooltip>
      case "rewards_v1":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#E68B00">Mining Reward</Tag></Tooltip>
      case "consensus_group_v1":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#FF6666">Consensus Election</Tag></Tooltip>
      case "poc_challengers":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#BE73FF">PoC Challenger</Tag></Tooltip>
      case "poc_challengees":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#595a9a">PoC Challengee</Tag></Tooltip>
      case "poc_witnesses":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#FFC769">PoC Witness</Tag></Tooltip>
      case "securities":
        return <Tooltip placement="bottom" title="Descriptor of what this particular transaction type is. Please edit me in TxnTag.js"><Tag color="#9AE8C9">Security Token Reward</Tag></Tooltip>
      default:
        return <Tag color="blue">{type}</Tag>
    }
  }

export default TxnTag
