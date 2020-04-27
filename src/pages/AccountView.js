import React, { Component } from 'react'
import { Card, Typography, Descriptions } from 'antd'
import Client from '@helium/http'
import AppLayout, { Content } from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import AddressModal from '../components/AddressModal'
import HotspotsList from '../components/HotspotsList'
import QRCode from 'react-qr-code'
import Fade from 'react-reveal/Fade'


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
       <Content style={{ marginTop: 0, background: '#27284B', padding: '60px 0 30px', overflowX: 'scroll' }}>
         <div style={{margin: '0 auto', maxWidth: 850, textAlign: 'center'}}>
         <Fade top>
         <div style={{background: 'white', borderRadius: 10, display: 'inline-block', padding: '10px 10px 5px', boxSizing: 'border-box', marginBottom: 30}}>
        
         <QRCode value={address} size={150} />
         </div>
         </Fade>
         <h3 style={{color: '#38A2FF'}}>Account:</h3>
         <Title code level={4} copyable style={{color: 'white', marginBottom: 0, fontWeight: 300}}>
                    {account.address}
                  </Title>
                  <Fade bottom>
                  <Title style={{color: '#38A2FF', fontWeight: 400, marginTop: 20, height: 80}}>
                  {!loading && (
                     <Descriptions.Item label="HNT" >
                  {account.balance.toString(2)}
                </Descriptions.Item>

                    )}</Title>
                    </Fade>

         </div>
         </Content>
        <Content style={{ marginTop: 50 }}>
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
        </Content>

        <HotspotsList address={address} />
        <ActivityList type="account" address={address} />
      </AppLayout>
    )
  }
}

export default AccountView
