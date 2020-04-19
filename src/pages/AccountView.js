import React, { Component } from 'react'
import { Row, Col, Table, Card, Typography } from 'antd'
import Client, { Network } from '@helium/http'
import AppLayout from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import AddressModal from '../components/AddressModal'
const { Title, Text } = Typography

const initialState = {
  account: {},
  hotspots: [],
  loading: true,
}

class AccountView extends Component {
  state = initialState

  componentDidMount() {
    this.client = new Client(Network.staging)
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.loadData()
    }
  }

  loadData = async () => {
    const { address } = this.props.match.params
    await this.setState(initialState)
    const account = await this.client.accounts.get(address)
    const list = await this.client.account(address).hotspots.list()
    const hotspots = []
    for await (const hotspot of list) {
      hotspots.push(hotspot)
    }

    this.setState({ account, hotspots, loading: false })
  }

  render() {
    const { account, hotspots, loading } = this.state
    const { address } = this.props.match.params
    const balanceColumns = [
      {
        title: 'HNT',
        dataIndex: 'balance',
        key: 'balance',
        render: (balance) => <span>{balance.toString()}</span>,
      },
      {
        title: 'Data Credits',
        dataIndex: 'dcBalance',
        key: 'dc_balance',
        render: (balance) => <span>{balance.toString()}</span>,
      },
      {
        title: 'Security Tokens',
        dataIndex: 'secBalance',
        key: 'sec_balance',
        render: (balance) => <span>{balance.toString()}</span>,
      },
    ]

    const hotspotColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (data, row) => <a href={'/hotspots/' + row.address}>{data}</a>,
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
    ]

    return (
      <AppLayout>
        <Row gutter={8} style={{ marginTop: 50 }}>
          <Col xs={16} offset={4}>
            <Card
              loading={loading}
              title="Account"
              extra={
                <AddressModal address={address} />
              }
            >
              <Text strong copyable>
                {account.address}
              </Text>
              <Table
                dataSource={[account]}
                columns={balanceColumns}
                size="small"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={8} style={{ marginTop: 20 }}>
          <Col xs={16} offset={4}>
            <Card loading={loading} title={'Hotspots'}>
              <Table
                dataSource={hotspots}
                columns={hotspotColumns}
                size="small"
                rowKey="name"
              />
            </Card>
          </Col>
        </Row>

        <ActivityList type="account" address={address} />
      </AppLayout>
    )
  }
}

export default AccountView
