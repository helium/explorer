import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import AccountIcon from '../../../components/AccountIcon'
import { Balance, CurrencyType } from '@helium/currency'

const PaymentV2 = ({ txn }) => {
  const totalAmountObject = new Balance(
    txn.totalAmount.integerBalance,
    CurrencyType.networkToken,
  )
  const feeObject = new Balance(txn.fee.integerBalance, CurrencyType.dataCredit)
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
      <Descriptions.Item label="Total HNT" span={3}>
        {totalAmountObject.toString(2)}
      </Descriptions.Item>
      {txn.payments.map((p, idx) => {
        const paymentAmountObject = new Balance(
          p.amount.integerBalance,
          CurrencyType.networkToken,
        )
        return (
          <Descriptions.Item label={'Payee ' + Number(idx + 1)} span={3}>
            <div style={{ display: 'flex' }}>
              <AccountIcon
                address={p.payee}
                style={{ marginRight: 4, maxHeight: 24 }}
              />
              <Link href={`/accounts/${p.payee}`}>
                <a>{`${p.payee} `}</a>
              </Link>
              <span style={{ marginLeft: 4 }}>
                ({paymentAmountObject.toString(2)})
              </span>
            </div>
          </Descriptions.Item>
        )
      })}
      <Descriptions.Item label="Fee" span={3}>
        {feeObject.toString()}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default PaymentV2
