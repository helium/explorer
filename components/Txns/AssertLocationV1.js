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

  useEffect(async () => {
    // make a client-side call to get the location (city, state, country) of the hotspot
    // TODO: make this call to the location endpoint (or equivalent helium-js function) instead for returning geo details for a given h3 index
    const client = new Client()
    const hotspotid = txn.gateway
    const hotspot = await client.hotspots.get(hotspotid)
    setHotspot(hotspot)
  }, [])

  const stakingFee = new Balance(txn.stakingFee, CurrencyType.dataCredit)
  const stakingFeePayer =
    txn.payer === txn.owner || txn.payer === null ? txn.owner : txn.payer

  const feeWithFunctions = new Balance(
    txn.fee.integerBalance,
    CurrencyType.dataCredit,
  )

  return (
    <>
      <AssertLocationMapbox txn={txn} />
      <Descriptions bordered>
        <Descriptions.Item label="Hotspot" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Link href={`/hotspots/${txn.gateway}`}>
              <a>{animalHash(txn.gateway)}</a>
            </Link>
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Owner" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <AccountIcon address={txn.owner} style={{ marginRight: 8 }} />
            <Link href={`/accounts/${txn.owner}`}>
              <a>{txn.owner}</a>
            </Link>
          </span>
        </Descriptions.Item>
        {/* TODO: add nicely formatted location for every transaction once there is an endpoint for getting geo details from h3 index */}
        {hotspot.lat === txn.lat && hotspot.lng === txn.lng && (
          <Descriptions.Item label="Location" span={3}>
            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              {formatLocation(hotspot.geocode)}
            </span>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Latitude" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {txn.lat}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Longitude" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {txn.lng}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Nonce" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {txn.nonce}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Fee" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {feeWithFunctions.toString()}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Staking Fee" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {stakingFee.toString()}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Staking Fee Payer" span={3}>
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <AccountIcon
                address={stakingFeePayer}
                style={{ marginRight: 8 }}
              />
              <Link href={`/accounts/${stakingFeePayer}`}>
                <a>{stakingFeePayer}</a>
              </Link>
            </span>
            <span style={{ paddingTop: 10 }}>
              {txn.payer === txn.owner || txn.payer === null
                ? '(Hotspot owner)'
                : '(Staking server)'}
            </span>
          </span>
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

export default AssertLocationV1
