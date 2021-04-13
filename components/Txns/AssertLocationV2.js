import { Descriptions, Tooltip } from 'antd'
import AccountIcon from '../AccountIcon'
import InfoIcon from '../Icons/Info'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import animalHash from 'angry-purple-tiger'

import { formatLocation, formatGain, formatElevation } from '../Hotspots/utils'
import { Balance, CurrencyType } from '@helium/currency'

const AssertLocationMapbox = dynamic(() => import('../AssertLocationMapbox'), {
  ssr: false,
  loading: () => <span style={{ height: '600px' }} />,
})

const AssertLocationV1 = ({ txn }) => {
  const stakingFeeObject = new Balance(
    txn.stakingFee.integerBalance,
    CurrencyType.dataCredit,
  )
  const stakingFeePayer =
    txn.payer === txn.owner || txn.payer === null ? txn.owner : txn.payer

  const feeObject = new Balance(txn.fee.integerBalance, CurrencyType.dataCredit)

  const makerName = txn.makerInfo

  return (
    <>
      <AssertLocationMapbox txn={txn} />
      <Descriptions bordered>
        <Descriptions.Item label="Hotspot" span={3}>
          <Link href={`/hotspots/${txn.gateway}`}>
            <a>{animalHash(txn.gateway)}</a>
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Owner" span={3}>
          <div className="flex flex-row items-center justify-start">
            <AccountIcon address={txn.owner} className="mr-2" />
            <Link href={`/accounts/${txn.owner}`}>
              <a>{txn.owner}</a>
            </Link>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Location" span={3}>
          {formatLocation(txn.geocode)}
        </Descriptions.Item>
        <Descriptions.Item label="Latitude" span={3}>
          {txn.lat}
        </Descriptions.Item>
        <Descriptions.Item label="Longitude" span={3}>
          {txn.lng}
        </Descriptions.Item>
        <Descriptions.Item label="Gain" span={3}>
          {formatGain(txn.gain)}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <div className="flex flex-row items-center justify-start">
              Elevation
              <Tooltip
                placement="top"
                title="This number represents how high above ground level the hotspot is. If this number is negative, it means the Hotspot is below ground level."
              >
                <div className="ml-2 flex flex-row items-center justify-center">
                  <InfoIcon className="text-gray-600 h-4 w-4" />
                </div>
              </Tooltip>
            </div>
          }
          span={3}
        >
          {formatElevation(txn.elevation)}
        </Descriptions.Item>
        <Descriptions.Item label="Nonce" span={3}>
          {txn.nonce}
        </Descriptions.Item>
        <Descriptions.Item label="Fee" span={3}>
          {feeObject.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Staking Fee" span={3}>
          {stakingFeeObject.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Staking Fee Payer Address" span={3}>
          <span className="flex flex-col items-start justify-center">
            <span className="flex flex-row items-center justify-start">
              <AccountIcon className="mr-2" address={stakingFeePayer} />
              <Link href={`/accounts/${stakingFeePayer}`}>
                <a>{stakingFeePayer}</a>
              </Link>
            </span>
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Staking Fee Payer" span={6}>
          {makerName}
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

export default AssertLocationV1
