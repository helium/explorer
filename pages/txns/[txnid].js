import React, { Component } from 'react'
import Link from 'next/link'
import { Typography, Card } from 'antd'
import { ClockCircleOutlined, WalletOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import AppLayout, { Content } from '../../components/AppLayout'
import PieChart from '../../components/PieChart'
import animalHash from 'angry-purple-tiger'
import moment from 'moment'
import { Collapse } from 'antd'
import { formatLocation } from '../../components/Hotspots/utils'

import {
  Fallback,
  PaymentV1,
  PaymentV2,
  PocReceiptsV1,
  RewardsV1,
  StateChannelCloseV1,
  PocRequestV1,
  ConsensusGroupV1,
  TxnTag,
} from '../../components/Txns'
import Block from '../../public/images/block.svg'

// import { Tooltip } from 'antd'

const { Panel } = Collapse
const { Title, Text } = Typography

const txnView = (txn) => {
  switch (txn.type) {
    case 'payment_v1':
      return <PaymentV1 txn={txn} />
    case 'payment_v2':
      return <PaymentV2 txn={txn} />
    case 'poc_request_v1':
      return <PocRequestV1 txn={txn} />
    case 'poc_receipts_v1':
      return <PocReceiptsV1 txn={txn} />
    case 'rewards_v1':
      return <RewardsV1 txn={txn} />
    case 'state_channel_close_v1':
      return <StateChannelCloseV1 txn={txn} />
    default:
      return <Fallback txn={txn} />
  }
}

const rewardChart = (txn) => {
  if (txn.type === 'rewards_v1') {
    const res = []
    if (txn.rewards.length > 0) {
      txn.rewards.forEach((t) => {
        let f = res.find((x) => x.name === t.type)
        if (f) {
          f.value++
        } else {
          let n = { name: t.type, value: 1 }
          res.push(n)
        }
      })
    }
    return res
  }
}

const TxnView = ({ txn }) => {
  let type = ''
  let description = ''
  const ogImageUrlBase = `https://explorer.helium.com/images/og`
  let ogImageUrl = ''
  const urlBase = 'https://explorer.helium.com'
  const url = `${urlBase}/txns/${txn.hash}`

  let dateString = `on 
  ${moment.utc(moment.unix(txn.time)).format('MMMM Do, YYYY')} at ${moment
    .utc(moment.unix(txn.time))
    .format('h:mm A')} UTC`
  let blockString = `in block ${txn.height.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`

  switch (txn.type) {
    case 'payment_v1':
      type = `Payment`
      description = `A payment of ${txn.amount.floatBalance.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )} HNT from account ${txn.payer.substring(
        0,
        5,
      )}... to account ${txn.payee.substring(
        0,
        5,
      )}... ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_payment.png`
      break
    case 'payment_v2':
      type = `Payment`
      description =
        txn.payments.length !== 1
          ? `A payment from account ${txn.payer.substring(0, 5)}... to ${
              txn.payments.length
            } accounts totaling ${txn.totalAmount.floatBalance.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )} HNT ${dateString} ${blockString}`
          : `A payment of ${txn.payments[0].amount.floatBalance.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )} HNT from account ${txn.payer.substring(
              0,
              5,
            )}... to account ${txn.payments[0].payee.substring(
              0,
              5,
            )}... ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_payment.png`
      break
    case 'poc_request_v1':
      type = `PoC Request`
      description = `A challenge constructed by ${animalHash(
        txn.challenger,
      )} ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_poc_request.png`
      break
    case 'poc_receipts_v1':
      type = `PoC Receipt`
      description = `A challenge constructed by ${animalHash(
        txn.challenger,
      )} for ${txn.path.length} other Hotspot${
        txn.path.length === 1 ? '' : 's'
      } ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_poc_receipt.png`
      break
    case 'rewards_v1':
      type = `Rewards`
      description = `A rewards transaction with ${txn.totalAmount.floatBalance.toLocaleString(
        undefined,
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )} total HNT rewarded to ${
        txn.rewards.length
      } accounts ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_rewards.png`
      break
    case 'state_channel_close_v1':
      type = `State Channel Close`
      description = `A state channel closed transaction ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_state_channel_close.png`
      break
    case 'state_channel_open_v1':
      type = `State Channel Open`
      description = `A state channel open transaction ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_state_channel_open.png`
      break
    case 'assert_location_v1':
      type = `Assert Location`
      description = `${animalHash(
        txn.gateway,
      )} asserted its location ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_assert_location.png`
      break
    case 'consensus_group_v1':
      type = `Consensus Election`
      description = `${txn.members.length} Hotspots were elected to a consensus group ${dateString} ${blockString}`
      break
    case 'add_gateway_v1':
      type = `Add Gateway`
      description = `${animalHash(
        txn.gateway,
      )} was added to the Helium blockchain ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn.png`
      break
    case 'transfer_hotspot_v1':
      type = `Transfer Hotspot`
      description = `Ownership of ${animalHash(
        txn.gateway,
      )} was transferred from account ${txn.seller.substring(
        0,
        5,
      )}... to account ${txn.buyer.substring(0, 5)}... for ${(
        txn.amountToSeller / 100000000
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} HNT ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn_transfer.png`
      break
    default:
      type = ``
      description = `A transaction ${dateString} ${blockString}`
      ogImageUrl = `${ogImageUrlBase}/txn.png`
      break
  }

  return (
    <AppLayout
      title={`${type === '' ? 'Transaction' : `${type} | Transaction`}`}
      description={description}
      openGraphImageAbsoluteUrl={ogImageUrl}
      url={url}
    >
      <Content
        style={{
          marginTop: 0,
          background: 'rgb(16, 23, 37)',
        }}
      >
        <div
          style={{ margin: '0 auto', maxWidth: 850 + 40 }}
          className="content-container-txn-view"
        >
          <div className="flex-responsive">
            <div style={{ paddingRight: 30, width: '100%' }}>
              <Title
                style={{
                  color: 'white',
                  fontSize: 52,
                  marginTop: 0,
                  lineHeight: 0.7,
                  letterSpacing: '-2px',
                }}
              >
                Transaction
              </Title>
              <Text
                copyable
                style={{
                  color: '#6A6B93',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}
              >
                {txn.hash}
              </Text>
              <p style={{ marginTop: 20 }}>
                <TxnTag type={txn.type} />
              </p>
              <p>
                <img
                  style={{
                    marginRight: 5,
                    position: 'relative',
                    top: '-1px',
                  }}
                  src={Block}
                  alt="img"
                />
                <Link href={'/blocks/' + txn.height}>
                  <a>{txn.height}</a>
                </Link>
              </p>
              {txn.type === 'rewards_v1' && (
                <p style={{ color: '#FFC769' }}>
                  <WalletOutlined
                    style={{ color: '#FFC769', marginRight: 6 }}
                  />
                  {txn.totalAmount.floatBalance.toLocaleString()} HNT
                </p>
              )}
            </div>

            {txn.type === 'rewards_v1' && (
              <div>
                <PieChart data={rewardChart(txn)} />
              </div>
            )}
          </div>
          <hr />
          <div
            //className="flexwrapper"
            // Temporary styling to center timestamp until next / prev transaction buttons work
            // at which point the flexwrapper class can be turned back on instead
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* TODO: efficiently determine next transaction and previous transaction */}
            {/* <a className="button">
                <BackwardOutlined style={{ marginleft: '-6px' }} /> Previous
                Transaction
              </a> */}

            <h3>
              <ClockCircleOutlined
                style={{ color: '#FFC769', marginRight: 4 }}
              />{' '}
              <Timestamp date={txn.time} />
            </h3>

            {/* <a className="button">
                Next Transaction{' '}
                <ForwardOutlined style={{ marginRight: '-6px' }} />
              </a> */}
          </div>
        </div>
      </Content>

      <Content
        style={{
          marginTop: '10px',
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 100,
        }}
      >
        <Card>
          <h2 style={{ padding: '44px 0 10px 24px' }}>Transaction Details</h2>
          {txnView(txn)}
        </Card>
      </Content>
    </AppLayout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const client = new Client()
  const { txnid } = params
  const txn = await client.transactions.get(txnid)

  return {
    props: {
      txn: JSON.parse(JSON.stringify(txn)),
    },
  }
}

export default TxnView
