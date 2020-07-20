import React, { Component } from 'react'
import { Typography, Tag, Table, Card, List, Descriptions } from 'antd'
import animalHash from 'angry-purple-tiger'
import { DollarOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../components/TxnTag'
import PocPath from '../components/PocPath'
import AppLayout, { Content } from '../components/AppLayout'
import Map from '../components/Map'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import hotspots from '../data/hotspots.json'
import {
  BackwardOutlined,
  ForwardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import Block from '../images/block.svg'

const { Title, Text } = Typography

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
})

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
    console.log(txn)
    this.setState({ txn, loading: false })
  }

  render() {
    const { txn, loading } = this.state

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
          return rewardsv1()
        case 'state_channel_close_v1':
          return stateChannelClosev1()

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

    const stateChannelClosev1 = () => {
      let totalPackets = 0
      let totalHotspots = txn.stateChannel.summaries.length
      let totalDcs = 0
      txn.stateChannel.summaries.map((s) => {
        totalPackets += s.num_packets
        totalDcs += s.num_dcs
      })
      const columns = [
        {
          title: 'Hotspot',
          dataIndex: 'client',
          key: 'client',
          render: (data) => <span>{animalHash(data)}</span>,
        },
        {
          title: 'Packets Sent',
          dataIndex: 'num_packets',
          key: 'num_packets',
        },
        {
          title: 'Data Credits Used',
          dataIndex: 'num_dcs',
          key: 'num_dcs',
        },
      ]
      const data = []
      return (
        <div>
          <Mapbox
            style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
            container="map"
            center={[-95.712891, 37.09024]}
            containerStyle={{
              height: '600px',
              width: '100%',
            }}
            zoom={[3]}
            movingMethod="jumpTo"
          >
            {txn.stateChannel.summaries.map((s) => {
              data.push({
                client: s.client,
                num_packets: s.num_packets,
                num_dcs: s.num_packets,
              })
              const hotspot = hotspots.data.find((e) => e.address === s.client)
              if (hotspot) {
                return (
                  <Marker
                    key={hotspot.address}
                    style={styles.gatewayMarker}
                    anchor="center"
                    coordinates={[hotspot.lng, hotspot.lat]}
                  />
                )
              }
            })}
            )}
          </Mapbox>

          <Descriptions bordered>
            <Descriptions.Item label="Block Height" span={3}>
              <a href={'/blocks/' + txn.height}>{txn.height}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Total Packets" span={3}>
              {totalPackets}
            </Descriptions.Item>
            <Descriptions.Item label="Data Credits Spent" span={3}>
              {totalDcs}
            </Descriptions.Item>
            <Descriptions.Item label="Number of Hotspots" span={3}>
              {totalHotspots}
            </Descriptions.Item>
            <Descriptions.Item label="State Channel Closer" span={3}>
              <a href={'/accounts/' + txn.closer}>{txn.closer}</a>
            </Descriptions.Item>
            <Descriptions.Item label="State Channel Owner" span={3}>
              <a href={'/accounts/' + txn.stateChannel.owner}>
                {txn.stateChannel.owner}
              </a>
            </Descriptions.Item>
          </Descriptions>

          <Table
            dataSource={data}
            columns={columns}
            style={{ marginTop: '10px' }}
          />

          <Descriptions bordered style={{ marginTop: '20px' }}>
            {Object.entries(txn).map(([key, value]) => {
              return (
                <Descriptions.Item label={key} span={3}>
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </div>
      )
    }

    const pocReceiptsv1 = () => (
      <div>
        <PocPath path={txn.path} />
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
                {key === 'path' ? JSON.stringify(value) : value}
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      </div>
    )

    const pocRequestv1 = () => {
      return (
        <div>
          <Map coords={[{ lat: txn.lat, lng: txn.lng }]} />
          <Descriptions bordered>
            <Descriptions.Item label="Hotspot" span={3}>
              <a href={'/hotspots/' + txn.challenger}>{txn.challenger}</a>
            </Descriptions.Item>
            <Descriptions.Item label="Owner" span={3}>
              <a href={'/accounts/' + txn.owner}>{txn.owner}</a>
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

    const rewardsv1 = () => {
      const columns = [
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          render: (data) => <TxnTag type={data}></TxnTag>,
        },
        {
          title: 'Account',
          dataIndex: 'account',
          key: 'account',
          render: (data) => <a href={'/accounts/' + data}>{data}</a>,
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: (data) => <span>{data.toString()}</span>,
        },
      ]
      return (
        <div>
          <div style={{ padding: '0 24px 50px' }}>
            <h3 style={{ color: '#444' }}>About Mining Reward Transactions</h3>
            <p>
              Bundles multiple reward transactions at the end of each epoch and
              distributes all HNT produced in that block to wallets that have
              earned them.{' '}
            </p>
          </div>
          <Table
            dataSource={txn.rewards}
            columns={columns}
            size="small"
            rowKey="payee"
            pagination={{ pageSize: 50 }}
            scroll={{ x: true }}
          />
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
      /*const columns = [
        {
          title: 'Payee',
          dataIndex: 'payee',
          key: 'payee',
          render: (data) => <a href={'/accounts/' + data}>{data}</a>,
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          render: (data) => <span>{data.toString()}</span>,
        },
      ]
      return (
        <div>
          <p>Total Amount: {txn.totalAmount.toString()} </p>
          <p>
            Payer: <a href={`/accounts/${txn.payer}`}>{txn.payer}</a>
          </p>
          <Table
            dataSource={txn.payments}
            columns={columns}
            size="small"
            rowKey="payee"
            pagination={{ pageSize: 50 }}
            scroll={{ x: true }}
          />
        </div>
      )*/
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
              </div>
              <p>
                <img
                  style={{ marginRight: 5, position: 'relative', top: '-1px' }}
                  src={Block}
                />
                <a href={'/blocks/' + txn.height}>{txn.height}</a>
              </p>
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
