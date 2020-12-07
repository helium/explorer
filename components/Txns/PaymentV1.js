import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import AccountIcon from '../AccountIcon'

const PaymentV1 = ({ txn }) => {
  return (
    <Descriptions bordered>
      <Descriptions.Item
        label="Payer"
        span={3}
        style={{ overflow: 'ellipsis' }}
      >
        <div style={{ display: 'flex' }}>
          <AccountIcon
            address={txn.payer}
            style={{ marginRight: 4, maxHeight: 24 }}
          />
          <Link href={`/accounts/${txn.payer}`}>
            <a>{txn.payer}</a>
          </Link>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Payee" span={3}>
        <div style={{ display: 'flex' }}>
          <AccountIcon
            address={txn.payee}
            style={{ marginRight: 4, maxHeight: 24 }}
          />
          <Link href={`/accounts/${txn.payee}`}>
            <a>{txn.payee}</a>
          </Link>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Amount" span={3}>
        {txn.amount.floatBalance.toString()} HNT
      </Descriptions.Item>
      <Descriptions.Item label="Fee" span={3}>
        {txn.fee.toString()}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default PaymentV1
