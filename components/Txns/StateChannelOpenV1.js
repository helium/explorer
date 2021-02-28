import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'

import AccountIcon from '../AccountIcon'

const StateChannelOpenV1 = ({ txn }) => (
  <Descriptions bordered>
    <Descriptions.Item label="Owner" span={3}>
      <div style={{ display: 'flex' }}>
        <AccountIcon
          address={txn.payer}
          style={{ marginRight: 4, maxHeight: 24 }}
        />
        <Link href={'/accounts/' + txn.owner}>{txn.owner}</Link>
      </div>
    </Descriptions.Item>
    <Descriptions.Item label="OUI" span={3}>
      {txn.oui}
    </Descriptions.Item>
    <Descriptions.Item label="Nonce" span={3}>
      {txn.nonce}
    </Descriptions.Item>
    <Descriptions.Item label="ID" span={3}>
      {txn.id}
    </Descriptions.Item>

    <Descriptions.Item label="Fee" span={3}>
      {txn.fee.floatBalance.toString()} DC
    </Descriptions.Item>
    <Descriptions.Item label="Expire within" span={3}>
      {txn.expireWithin} Blocks
    </Descriptions.Item>
    <Descriptions.Item label="Amount" span={3}>
      {txn.amount.floatBalance.toString()} HNT
    </Descriptions.Item>
  </Descriptions>
)

export default StateChannelOpenV1
