import { Descriptions } from 'antd'
import AccountIcon from '../AccountIcon'

import Link from 'next/link'
import animalHash from 'angry-purple-tiger'

import { Balance, CurrencyType } from '@helium/currency'

const AddGatewayV1 = ({ txn }) => {
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
      <Descriptions.Item label="Staking Fee Payer" span={3}>
        <div className="flex flex-col items-start justify-center">
          <div className="flex flex-row items-center justify-start">
            <AccountIcon address={stakingFeePayer} className="mr-2" />
            <Link href={`/accounts/${stakingFeePayer}`}>
              <a>{stakingFeePayer}</a>
            </Link>
          </div>
          <span className="pt-2">
            {txn.payer === txn.owner || txn.payer === null
              ? '(Hotspot owner)'
              : '(Staking server)'}
          </span>
        </div>
      </Descriptions.Item>
    </Descriptions>
  )
}

export default AddGatewayV1
