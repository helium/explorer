import React, { Component } from 'react'
import { Typography, Card, Descriptions, List } from 'antd'

import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../components/TxnTag'
import PocPath from '../components/PocPath'
import AppLayout, { Content } from '../components/AppLayout'
import PieChart from '../components/PieChart'
import TxnReward from '../components/TxnReward'
import TxnSCClose from '../components/TxnSCClose'
import animalHash from 'angry-purple-tiger'

import {
  BackwardOutlined,
  ForwardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import Block from '../images/block.svg'

const { Title, Text } = Typography

const styles = {
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#1B8DFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  transmittingMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  gatewayMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#A984FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #8B62EA',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

class TxnView extends Component {
  state = {
    txn: {},
    loading: true,
  }

  componentDidMount() {
    this.client = new Client()
    this.loadTxn()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.loadTxn()
    }
  }

  async loadTxn() {
    const { hash } = this.props.match.params
    const txn = await this.client.transactions.get(hash)
    this.setState({ txn, loading: false })
  }

  rewardChart() {
    const { txn } = this.state
    if (txn.type === 'rewards_v1') {
      const res = []
      if (txn.rewards.length > 0) {
        txn.rewards.map((t) => {
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

  render() {
    const { txn, loading } = this.state
    console.log(txn)

    const txnView = (type) => {
      switch (type) {
        case 'payment_v1':
          return paymentv1()
        case 'payment_v2':
          return paymentv2()
        case 'poc_request_v1':
          return pocRequestv1()
        case 'poc_receipts_v1':
          return pocReceiptsv1()
        case 'rewards_v1':
          return <TxnReward txn={txn} />
        case 'state_channel_close_v1':
          return <TxnSCClose txn={txn} />

        default:
          return (
            <Descriptions bordered>
              {Object.entries(txn).map(([key, value]) => {
                return (
                  <Descriptions.Item label={key} span={3}>
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          )
      }
    }

    const pocReceiptsv1 = () => (
      <div>
        <PocPath path={txn.path} />
        <Descriptions bordered>
          <Descriptions.Item label="Challenger" span={3}>
            <a href={'/hotspots/' + txn.challenger}>
              {animalHash(txn.challenger)}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Block Height" span={3}>
            <a href={'/blocks/' + txn.height}>{txn.height}</a>
          </Descriptions.Item>
          <Descriptions.Item label="PoC Path" span={3}>
            <ol>
              {txn.path.map((p, idx) => {
                return (
                  <div>
                    <p style={{ marginBottom: '0px', paddingTop: '10px' }}>
                      {idx + 1} -
                      <a href={'/hotspots/' + p.challengee}>
                        {animalHash(p.challengee)}
                      </a>
                    </p>
                    {p.witnesses.length > 0 &&
                      p.witnesses.map((w) => {
                        return (
                          <div style={{ marginLeft: '25px' }}>
                            <span>
                              <small>
                                <a href={'/hotspots/' + txn.challenger}>
                                  {animalHash(w.gateway)}
                                </a>
                                - RSSI {w.signal}dBm, SNR {w.snr.toFixed(2)}dB,{' '}
                                {String.fromCharCode.apply(null, w.datarate)} (
                                {w.is_valid ? 'valid' : 'invalid'})
                              </small>
                            </span>
                          </div>
                        )
                      })}
                  </div>
                )
              })}
            </ol>
          </Descriptions.Item>
        </Descriptions>
      </div>
    )

    const pocRequestv1 = () => {
      console.log(txn)
      return (
        <div>
          <Descriptions bordered>
            <Descriptions.Item label="Hotspot" span={3}>
              <a href={'/hotspots/' + txn.challenger}>{txn.challenger}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Owner" span={3}>
              <a href={'/accounts/' + txn.challengerOwner}>
                {txn.challengerOwner}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Block Height" span={3}>
              <a href={'/blocks/' + txn.height}>{txn.height}</a>
            </Descriptions.Item>
            {Object.entries(txn).map(([key, value]) => {
              return (
                <Descriptions.Item label={key} span={3}>
                  {value}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </div>
      )
    }

    const paymentv1 = () => {
      return (
        <Descriptions bordered>
          <Descriptions.Item
            label="Payer"
            span={3}
            style={{ overflow: 'ellipsis' }}
          >
            <a href={`/accounts/${txn.payer}`}>{txn.payer}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Payee" span={3}>
            <a href={`/accounts/${txn.payee}`}>{txn.payee}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Amount" span={3}>
            {txn.amount.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="Fee" span={3}>
            {txn.fee.toString()}
          </Descriptions.Item>
        </Descriptions>
      )
    }

    const paymentv2 = () => {
      return (
        <Descriptions bordered>
          <Descriptions.Item
            label="Payer"
            span={3}
            style={{ overflow: 'ellipsis' }}
          >
            <a href={`/accounts/${txn.payer}`}>{txn.payer}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Total HNT" span={3}>
            {txn.totalAmount.toString()}
          </Descriptions.Item>
          {txn.payments.map((p, idx) => {
            console.log(idx)
            return (
              <Descriptions.Item label={'Payee ' + Number(idx + 1)} span={3}>
                <a href={`/accounts/${p.payee}`}>{p.payee}</a> (
                {p.amount.toString()})
              </Descriptions.Item>
            )
          })}
          <Descriptions.Item label="Fee" span={3}>
            {txn.fee.toString()}
          </Descriptions.Item>
        </Descriptions>
      )
    }

    return (
      <AppLayout>
        <Content
          style={{
            marginTop: 0,
            background: '#27284B',
            padding: '60px 0 30px',
          }}
        >
          <div style={{ margin: '0 auto', maxWidth: 850 }}>
            <div className="flexwrapper" style={{ alignItems: 'flex-start' }}>
              <div>
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
                  style={{ color: '#6A6B93', fontFamily: 'monospace' }}
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
                  />
                  <a href={'/blocks/' + txn.height}>{txn.height}</a>
                </p>
              </div>

              {txn.type === 'rewards_v1' && (
                <div>
                  <PieChart data={this.rewardChart()} />
                </div>
              )}
            </div>
            <hr />
            <div className="flexwrapper">
              <a className="button">
                <BackwardOutlined style={{ marginleft: '-6px' }} /> Previous
                Transaction
              </a>

              <h3>
                <ClockCircleOutlined
                  style={{ color: '#FFC769', marginRight: 4 }}
                />{' '}
                <Timestamp date={txn.time} />
              </h3>

              <a className="button">
                Next Transaction{' '}
                <ForwardOutlined style={{ marginRight: '-6px' }} />
              </a>
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
          <Card loading={loading}>
            <h2 style={{ padding: '44px 0 10px 24px' }}>Transaction Details</h2>
            {txnView(txn.type)}
          </Card>
        </Content>
      </AppLayout>
    )
  }
}

export default TxnView
