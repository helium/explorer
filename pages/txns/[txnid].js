import React from 'react'
import Link from 'next/link'
import { Typography, Card } from 'antd'
import { ClockCircleOutlined, WalletOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import AppLayout, { Content } from '../../components/AppLayout'
import PieChart from '../../components/PieChart'
import { getMetaTagsForTransaction } from '../../components/Txns/utils'
import { Balance, CurrencyType } from '@helium/currency'

import {
  Fallback,
  AssertLocationV1,
  PaymentV1,
  PaymentV2,
  PocReceiptsV1,
  RewardsV1,
  StateChannelCloseV1,
  PocRequestV1,
  TransferHotspotV1,
  ConsensusGroupV1,
  TxnTag,
} from '../../components/Txns'
import Block from '../../public/images/block.svg'

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
    case 'consensus_group_v1':
      return <ConsensusGroupV1 txn={txn} />
    case 'state_channel_close_v1':
      return <StateChannelCloseV1 txn={txn} />
    case 'transfer_hotspot_v1':
      return <TransferHotspotV1 txn={txn} />
    case 'assert_location_v1':
      return <AssertLocationV1 txn={txn} />
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
  const transactionMetaTags = getMetaTagsForTransaction(txn)

  const txnTotalAmountWithFunctions =
    txn.type === 'rewards_v1' &&
    new Balance(txn.totalAmount.integerBalance, CurrencyType.networkToken)

  return (
    <AppLayout
      title={`${
        transactionMetaTags.type === 'default'
          ? 'Transaction'
          : `${transactionMetaTags.type} | Transaction`
      }`}
      description={transactionMetaTags.description}
      openGraphImageAbsoluteUrl={transactionMetaTags.ogImageUrl}
      url={transactionMetaTags.url}
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
                  {txnTotalAmountWithFunctions.toString(2)}
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
              />
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
  let txn = await client.transactions.get(txnid)

  return {
    props: {
      txn: JSON.parse(JSON.stringify(txn)),
    },
  }
}

export default TxnView
