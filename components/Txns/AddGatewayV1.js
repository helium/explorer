import { useState, useEffect } from 'react'
import { Descriptions } from 'antd'
import AccountIcon from '../AccountIcon'

import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import { getMakerName } from '../Txns/utils'

import { Balance, CurrencyType } from '@helium/currency'

const AddGatewayV1 = ({ txn }) => {
  const [makerName, setMakerName] = useState('')
  const [makerNameLoading, setMakerNameLoading] = useState(true)

  const getMakerInfo = async (payerAddress) => {
    if (payerAddress === txn.owner || payerAddress === null) {
      setMakerName('Hotspot owner')
      setMakerNameLoading(false)
    } else {
      setMakerNameLoading(true)
      const makerName = await getMakerName(payerAddress)
      setMakerName(makerName)
      setMakerNameLoading(false)
    }
  }
  useEffect(() => {
    getMakerInfo(txn.payer)
  }, [])

  const stakingFeeObject = new Balance(
    txn.stakingFee.integerBalance,
    CurrencyType.dataCredit,
  )
  const stakingFeePayer =
    txn.payer === txn.owner || txn.payer === null ? txn.owner : txn.payer

  const feeObject = new Balance(txn.fee.integerBalance, CurrencyType.dataCredit)

  return (
    <Descriptions bordered>
      <Descriptions.Item label="Hotspot" span={3}>
        <div className="flex flex-row items-center justify-start">
          <Link href={`/hotspots/${txn.gateway}`}>
            <a>{animalHash(txn.gateway)}</a>
          </Link>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Owner" span={3}>
        <div className="flex flex-row items-center justify-start">
          <AccountIcon address={txn.owner} className="mr-2" />
          <Link href={`/accounts/${txn.owner}`}>
            <a>{txn.owner}</a>
          </Link>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Fee" span={3}>
        <div className="flex flex-row items-center justify-start">
          {feeObject.toString()}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Staking Fee" span={3}>
        <div className="flex flex-row items-center justify-start">
          {stakingFeeObject.toString()}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Staking Fee Payer Address" span={3}>
        <span className="flex flex-col items-start justify-center">
          <span className="flex flex-row items-center justify-start">
            <AccountIcon address={stakingFeePayer} style={{ marginRight: 8 }} />
            <Link href={`/accounts/${stakingFeePayer}`}>
              <a>{stakingFeePayer}</a>
            </Link>
          </span>
        </span>
      </Descriptions.Item>
      <Descriptions.Item label="Staking Fee Payer" span={3}>
        {makerNameLoading ? 'Loading...' : makerName}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default AddGatewayV1
