import React, { useState, useEffect } from 'react'
import { Descriptions } from 'antd'
import AccountIcon from '../AccountIcon'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import animalHash from 'angry-purple-tiger'
import Client from '@helium/http'

import { formatLocation } from '../Hotspots/utils'
import { Balance, CurrencyType } from '@helium/currency'

const AssertLocationMapbox = dynamic(() => import('../AssertLocationMapbox'), {
  ssr: false,
  loading: () => <span style={{ height: '600px' }} />,
})

const AssertLocationV1 = ({ txn }) => {
  const [hotspot, setHotspot] = useState({})

  const getHotspot = async () => {
    // make a client-side call to get the location (city, state, country) of the hotspot
    // TODO: make this call to the location endpoint (or equivalent helium-js function) instead for returning geo details for a given h3 index
    const client = new Client()
    const hotspotid = txn.gateway
    const hotspot = await client.hotspots.get(hotspotid)
    setHotspot(hotspot)
  }

  useEffect(() => {
    getHotspot()
  }, [])

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
        {/* TODO: add nicely formatted location for every transaction once there is an endpoint for getting geo details from h3 index */}
        {hotspot.lat === txn.lat && hotspot.lng === txn.lng && (
          <Descriptions.Item label="Location" span={3}>
            {formatLocation(hotspot.geocode)}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Latitude" span={3}>
          {txn.lat}
        </Descriptions.Item>
        <Descriptions.Item label="Longitude" span={3}>
          {txn.lng}
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
