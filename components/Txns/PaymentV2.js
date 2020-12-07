import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import AccountIcon from '../AccountIcon'

const PaymentV2 = ({ txn }) => (
  <Descriptions bordered>
    <Descriptions.Item label="Payer" span={3} style={{ overflow: 'ellipsis' }}>
      <div style={{ display: 'flex' }}>
        <AccountIcon address={txn.payer} style={{ marginRight: 4 }} />
        <Link href={`/accounts/${txn.payer}`}>
          <a>{txn.payer}</a>
        </Link>
      </div>
    </Descriptions.Item>
    <Descriptions.Item label="Total HNT" span={3}>
      {txn.totalAmount.floatBalance.toString()} HNT
    </Descriptions.Item>
    {txn.payments.map((p, idx) => {
      return (
        <Descriptions.Item label={'Payee ' + Number(idx + 1)} span={3}>
          <div style={{ display: 'flex' }}>
            <AccountIcon address={p.payee} style={{ marginRight: 4 }} />
            <Link href={`/accounts/${p.payee}`}>
              <a>{`${p.payee} `}</a>
            </Link>
            <span style={{ marginLeft: 4 }}>
              ({p.amount.floatBalance.toString()} HNT)
            </span>
          </div>
        </Descriptions.Item>
      )
    })}
    <Descriptions.Item label="Fee" span={3}>
      {txn.fee.floatBalance.toString()} DC
    </Descriptions.Item>
  </Descriptions>
)

export default PaymentV2
