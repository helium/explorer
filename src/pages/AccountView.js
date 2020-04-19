import React, { Component } from 'react'
import { Row, Col, Table, Card, Typography, Descriptions } from 'antd'
import Client from '@helium/http'
import AppLayout from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import AddressModal from '../components/AddressModal'
import HotspotsList from '../components/HotspotsList'

const { Title, Text } = Typography

const initialState = {
  account: {},
  loading: true,
}

class AccountView extends Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
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

    this.setState({ account, loading: false })
  }

  render() {
    const { account, loading } = this.state
    const { address } = this.props.match.params

    return (
      <AppLayout>
        <Row gutter={8} style={{ marginTop: 50 }}>
          <Col xs={16} offset={4}>
            <Card
              loading={loading}
              title="Account"
              extra={<AddressModal address={address} />}
            >
              {!loading && (
                <Descriptions bordered>
                  <Descriptions.Item label="Address" span={3}>
                    <Text code copyable>
                      {account.address}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="HNT">
                    {account.balance.toString(2)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Data Credits">
                    {account.dcBalance.toString(2)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Security Tokens">
                    {account.secBalance.toString(2)}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>
        </Row>

        <HotspotsList address={address} />
        <ActivityList type="account" address={address} />
      </AppLayout>
    )
  }
}

export default AccountView
