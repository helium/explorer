import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'

const StateChannelOpenV1 = ({ txn }) => (
  <Descriptions bordered>
    <Descriptions.Item label="type" span={3}>
      {txn.type}
    </Descriptions.Item>
    <Descriptions.Item label="owner" span={3}>
      <Link href={'/accounts/' + txn.owner}>{txn.owner}</Link>
    </Descriptions.Item>
    <Descriptions.Item label="oui" span={3}>
      {txn.oui}
    </Descriptions.Item>
    <Descriptions.Item label="nonce" span={3}>
      {txn.nonce}
    </Descriptions.Item>
    <Descriptions.Item label="id" span={3}>
      {txn.id}
    </Descriptions.Item>
    <Descriptions.Item label="hash" span={3}>
      <Link href={'/txns/' + txn.hash}>{txn.hash}</Link>
    </Descriptions.Item>
    <Descriptions.Item label="fee" span={3}>
      {txn.fee.floatBalance.toString()} DC
    </Descriptions.Item>
    <Descriptions.Item label="expireWithin" span={3}>
      {txn.expireWithin}
    </Descriptions.Item>
    <Descriptions.Item label="amount" span={3}>
      {txn.amount.floatBalance.toString()} HNT
    </Descriptions.Item>
  </Descriptions>
)

export default StateChannelOpenV1
