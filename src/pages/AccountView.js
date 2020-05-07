import React, { Component } from 'react'
import { Card, Typography, Descriptions, Tooltip } from 'antd'
import Client from '@helium/http'
import AppLayout, { Content } from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import AddressModal from '../components/AddressModal'
import HotspotsList from '../components/HotspotsList'
import QRCode from 'react-qr-code'
import Fade from 'react-reveal/Fade'

import {
  BackwardOutlined,
  ForwardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

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
        <Content
          style={{
            marginTop: 0,
            background: '#27284B',
            padding: '80px 0 50px',
            overflowX: 'hidden',
          }}
        >
          <div style={{ margin: '0 auto', maxWidth: 850, textAlign: 'center' }}>
            <Fade top>
              <div
                style={{
                  background: 'white',
                  borderRadius: 10,
                  display: 'inline-block',
                  padding: '10px 10px 5px',
                  boxSizing: 'border-box',
                  marginBottom: 30,
                }}
              >
                <QRCode value={address} size={150} />
              </div>
            </Fade>
            <h3 style={{ color: '#38A2FF' }}>Account:</h3>
            <Fade delay={1000}>
              <Title
                code
                level={4}
                copyable
                style={{ color: 'white', marginBottom: 0, fontWeight: 300 }}
              >
                {account.address}
              </Title>
            </Fade>
            <Fade bottom>
              <Title
                style={{
                  color: '#38A2FF',
                  fontWeight: 400,
                  marginTop: 20,
                  height: 60,
                }}
              >
                {!loading && (
                  <Descriptions.Item label="HNT">
                    {account.balance.toString(2)}
                  </Descriptions.Item>
                )}
              </Title>
            </Fade>
          </div>
        </Content>

        <div className="bottombar">
          <Fade bottom delay={1000}>
            <Content style={{ maxWidth: 850, margin: '0 auto' }}>
              <div className="flexwrapper" style={{ justifyContent: 'center' }}>
                <Tooltip
                  placement="bottom"
                  title="The amount of Data Credits this account owns."
                >
                  <h3 style={{ margin: '0 20px' }}>
                    {' '}
                    <ClockCircleOutlined
                      style={{ color: '#FFC769', marginRight: 5 }}
                    />
                    {!loading && (
                      <Descriptions.Item label="Data Credits">
                        {account.dcBalance.toString(2)}
                      </Descriptions.Item>
                    )}
                  </h3>
                </Tooltip>

                <Tooltip
                  placement="bottom"
                  title="The amount of Security Tokens this account owns."
                >
                  <h3 style={{ margin: '0 20px' }}>
                    <CheckCircleOutlined
                      style={{ color: '#29D391', marginRight: 5 }}
                    />
                    {!loading && (
                      <Descriptions.Item label="Security Tokens">
                        {account.secBalance.toString(2)}
                      </Descriptions.Item>
                    )}
                  </h3>
                </Tooltip>
              </div>
            </Content>
          </Fade>
        </div>

        <Content
          style={{
            margin: '0 auto',
            maxWidth: 850,
            paddingBottom: 100,
            marginTop: 0,
          }}
        >
          <HotspotsList address={address} />
          <ActivityList type="account" address={address} title={'Hello'} />
        </Content>
      </AppLayout>
    )
  }
}

export default AccountView
