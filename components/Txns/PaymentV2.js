import React from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import AccountIcon from '../AccountIcon'
import { Balance, CurrencyType } from '@helium/currency'

const PaymentV2 = ({ txn }) => {
  const totalAmountWithFunctions = new Balance(
    txn.totalAmount.integerBalance,
    CurrencyType.networkToken,
  )
  const feeWithFunctions = new Balance(
    txn.fee.integerBalance,
    CurrencyType.dataCredit,
  )
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
        {totalAmountWithFunctions.toString(2)}
      </Descriptions.Item>
      {txn.payments.map((p, idx) => {
        const paymentAmountWithFunctions = new Balance(
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
                ({paymentAmountWithFunctions.toString(2)})
              </span>
            </div>
          </Descriptions.Item>
        )
      })}
      <Descriptions.Item label="Fee" span={3}>
        {feeWithFunctions.toString()}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default PaymentV2
