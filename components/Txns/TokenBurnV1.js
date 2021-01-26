import React, { useState, useEffect } from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import AccountIcon from '../AccountIcon'
import { Balance, CurrencyType } from '@helium/currency'
import Client from '@helium/http'

const TokenBurnV1 = ({ txn }) => {
  const txnAmountObject = new Balance(txn.amount, CurrencyType.networkToken)
  const txnFeeObject = new Balance(
    txn.fee.integerBalance,
    CurrencyType.dataCredit,
  )

  const [oraclePrice, setOraclePrice] = useState()
  useEffect(async () => {
    const client = new Client()
    const { price } = await client.oracle.getPriceAtBlock(txn.height)
    setOraclePrice(price)
  }, [])

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
        {txnAmountObject.toString(2)}
      </Descriptions.Item>
      <Descriptions.Item label="Oracle Price" span={3}>
        {oraclePrice && oraclePrice.toString(2)}
      </Descriptions.Item>
      <Descriptions.Item label="Value" span={3}>
        {oraclePrice && txnAmountObject.toUsd(oraclePrice).toString(2)}
      </Descriptions.Item>
      <Descriptions.Item label="Fee" span={3}>
        {txnFeeObject.toString()}
      </Descriptions.Item>
      <Descriptions.Item label="Nonce" span={3}>
        {txn.nonce}
      </Descriptions.Item>
      <Descriptions.Item label="Memo" span={3}>
        {txn.memo}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default TokenBurnV1
