import React, { Component } from 'react'
import { Typography, Tag, Table, Card, List, Descriptions } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import Client from '@helium/http'
import Timestamp from 'react-timestamp'
import TxnTag from '../components/TxnTag'
import PocPath from '../components/PocPath'
import AppLayout, { Content } from '../components/AppLayout'
import Map from '../components/Map'
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

    const pocReceiptsv1 = () => {
      return (
        <div>
          <PocPath path={txn.path} />
          <List.Item>Challenging Hotspot: <a href={'/hotspots/' + txn.challenger}>{txn.challenger}</a></List.Item>
          <List.Item>Challenging Owner: <a href={'/accounts/' + txn.challengerOwner}>{txn.challengerOwner}</a></List.Item>
          <List.Item>Block Height: <a href={'/blocks/' + txn.height}>{txn.height}</a></List.Item>
          <List
            dataSource={Object.entries(txn).map(([key, value]) => {
              return key + ' ' + value
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </div>
      )
    }

    const pocRequestv1 = () => {
      return (
        <div>
          <Map coords={[{lat: txn.lat, lng: txn.lng}]} />
          <List.Item>Challenging Hotspot: <a href={'/hotspots/' + txn.challenger}>{txn.challenger}</a></List.Item>
          <List.Item>Challenging Owner: <a href={'/accounts/' + txn.owner}>{txn.owner}</a></List.Item>
          <List.Item>Block Height: <a href={'/blocks/' + txn.height}>{txn.height}</a></List.Item>
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
          <p>Payer: <a href={`/accounts/${txn.payer}`}>{txn.payer}</a></p>
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
        <Content style={{ marginTop: 50 }}>
          <Card loading={loading}>
            <Title level={3} style={{ wordBreak: 'break-all' }}>
              <DollarOutlined /> {txn.hash}
            </Title>
            <Tag color="green">
              <Timestamp date={txn.time}></Timestamp>
            </Tag>
            <TxnTag type={txn.type}></TxnTag>
          </Card>
        </Content>

        <Content style={{ marginTop: '10px' }}>
          <Card loading={loading}>
            <Title level={4}>Transaction Details</Title>
            {txnView(txn.type)}
          </Card>
        </Content>
      </AppLayout>
    )
  }
}

export default TxnView
