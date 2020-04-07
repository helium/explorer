import React, { Component } from 'react'
import { Tag, Icon } from 'antd';

const TxnTag = ({ type }) => (
  typeTag(type)
)

const typeTag = (type) => {
    switch(type) {
      case "payment_v1":
        return <Tag color="green">payment</Tag>
        case "payment_v2":
          return <Tag color="cyan">payment</Tag>
      case "poc_request_v1":
        return <Tag color="red">PoC challenge</Tag>
      case "poc_receipts_v1":
        return <Tag color="orange">PoC receipt</Tag>
      case "rewards_v1":
        return <Tag color="magenta">mining rewards</Tag>
      case "consensus_group_v1":
        return <Tag color="purple">consensus election</Tag>
      case "poc_challengers":
        return <Tag color="geekblue">PoC challenger</Tag>
      case "poc_challengees":
        return <Tag color="volcano">PoC challengee</Tag>
      case "poc_witnesses":
        return <Tag color="cyan">PoC witness</Tag>
      case "securities":
        return <Tag color="gold">security token reward</Tag>
      default:
        return <Tag color="blue">{type}</Tag>
    }
  }

export default TxnTag
