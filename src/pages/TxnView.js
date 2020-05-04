import React, { Component } from 'react'
import { Typography, Tag, Table, Card, List, Descriptions } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../components/TxnTag'
import PocPath from '../components/PocPath'
import AppLayout, { Content } from '../components/AppLayout'
import Map from '../components/Map'
import {
  BackwardOutlined,
  ForwardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import Block from '../images/block.svg'

const { Title, Text } = Typography

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

        default:
          return (
            <List
              dataSource={Object.entries(txn).map(([key, value]) => {
                return key + ' ' + value
              })}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              style={{ overflowX: 'hidden' }}
            />
          )
      }
    }

    const pocReceiptsv1 = () => (
      <div>
        <PocPath path={txn.path} />
        <List.Item>
          Challenging Hotspot:{' '}
          <a href={'/hotspots/' + txn.challenger}>{txn.challenger}</a>
        </List.Item>
        <List.Item>
          Challenging Owner:{' '}
          <a href={'/accounts/' + txn.challengerOwner}>{txn.challengerOwner}</a>
        </List.Item>
        <List.Item>
          Block Height: <a href={'/blocks/' + txn.height}>{txn.height}</a>
        </List.Item>
        <List
          dataSource={Object.entries(txn).map(([key, value]) => {
            return key + ' ' + value
          })}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    )

    const pocRequestv1 = () => {
      return (
        <div>
          <Map coords={[{ lat: txn.lat, lng: txn.lng }]} />
          <List.Item>
            Challenging Hotspot:{' '}
            <a href={'/hotspots/' + txn.challenger}>{txn.challenger}</a>
          </List.Item>
          <List.Item>
            Challenging Owner:{' '}
            <a href={'/accounts/' + txn.owner}>{txn.owner}</a>
          </List.Item>
          <List.Item>
            Block Height: <a href={'/blocks/' + txn.height}>{txn.height}</a>
          </List.Item>

          <List
            dataSource={Object.entries(txn).map(([key, value]) => {
              return key + ' ' + value
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
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
          <Descriptions.Item label="Payer" span={3}>
            <a href={`/accounts/${txn.payer}`}>{txn.payer}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Payee" span={3}>
            <a href={`/accounts/${txn.payee}`}>{txn.payee}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Amount" span={3}>
            {txn.amount.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="Signature" span={3}>
            {txn.signature}
          </Descriptions.Item>
        </Descriptions>
      )
    }

    const paymentv2 = () => {
      const columns = [
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
