import { useState, useEffect } from 'react'
import { Typography, Descriptions, Tooltip } from 'antd'
import Client from '@helium/http'
import AppLayout, { Content } from '../../components/AppLayout'
import ActivityList from '../../components/ActivityList'
import HotspotsList from '../../components/HotspotsList'
import QRCode from 'react-qr-code'
import Fade from 'react-reveal/Fade'
import { Balance, CurrencyType } from '@helium/currency'

import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import AccountIcon from '../../components/AccountIcon'
import AccountAddress from '../../components/AccountAddress'
import { fetchRewardsSummary } from '../../data/hotspots'

const { Title } = Typography

const AccountView = ({ account }) => {
  const dcBalanceObject = new Balance(
    account.dcBalance.integerBalance,
    CurrencyType.dataCredit,
  )
  const balanceObject = new Balance(
    account.balance.integerBalance,
    CurrencyType.networkToken,
  )
  const hstBalanceObject = new Balance(
    account.secBalance.integerBalance,
    CurrencyType.security,
  )

  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getHotspots() {
      const client = new Client()
      const accountid = account.address

      const list = await client.account(accountid).hotspots.list()

      const hotspots = []
      for await (const hotspot of list) {
        hotspot.status.gpsText = gpsLocation(hotspot.status.gps)
        hotspot.rewards = await fetchRewardsSummary(hotspot.address)
        delete hotspot.client
        hotspots.push(JSON.parse(JSON.stringify(hotspot)))
      }
      setHotspots(hotspots)
      setLoading(false)
    }
    getHotspots()
  }, [])

  return (
    <AppLayout
      title={`${account.address.substring(0, 5)}... | Account`}
      description={`An account on the Helium blockchain with ${balanceObject.toString(
        2,
      )}${
        account.dcBalance.integerBalance > 0
          ? account.secBalance.integerBalance === 0
            ? ` and ${dcBalanceObject.toString()}`
            : `, ${dcBalanceObject.toString()}`
          : ''
      }${
        account.secBalance.integerBalance > 0
          ? account.dcBalance.integerBalance === 0
            ? ` and ${hstBalanceObject.toString()}`
            : `, and ${hstBalanceObject.toString()}`
          : ''
      }, with the address ${account.address}`}
      openGraphImageAbsoluteUrl={`https://explorer.helium.com/images/og/accounts.png`}
      url={`https://explorer.helium.com/accounts/accounts/${account.address}`}
    >
      <Content
        style={{
          marginTop: 0,
          background: 'rgb(16, 23, 37)',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: 850 + 40,
            textAlign: 'center',
          }}
          className="content-container-account-view"
        >
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
              <QRCode
                value={account.address ? account.address : ''}
                size={150}
              />
            </div>
          </Fade>
          <Fade delay={1000}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AccountIcon address={account.address} size={48} />
              <Title
                code
                level={2}
                copyable={{ text: account.address }}
                style={{
                  color: 'white',
                  marginBottom: 0,
                  fontWeight: 300,
                  wordBreak: 'break-all',
                  marginLeft: 6,
                }}
              >
                <AccountAddress address={account.address} truncate />
              </Title>
            </div>
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
              <Descriptions.Item label="HNT">
                {balanceObject.toString(2)}
              </Descriptions.Item>
            </Title>
          </Fade>
        </div>
      </Content>

      <div
        style={{
          width: '100%',
          backgroundColor: '#2A344A',
          padding: '20px',
          textAlign: 'center',
        }}
      >
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
                  <Descriptions.Item label="Data Credits">
                    {dcBalanceObject.toString()}
                  </Descriptions.Item>
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
                  <Descriptions.Item label="Security Tokens">
                    {hstBalanceObject.toString(2)}
                  </Descriptions.Item>
                </h3>
              </Tooltip>
            </div>
          </Content>
        </Fade>
      </div>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1000,
          paddingBottom: 100,
          marginTop: 0,
        }}
      >
        <HotspotsList loading={loading} hotspots={hotspots} />
        <ActivityList
          type="account"
          address={account.address}
          hotspots={hotspots}
        />
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
  const { accountid } = params
  const account = await client.accounts.get(accountid)

  return {
    props: {
      account: JSON.parse(JSON.stringify(account)),
    },
    revalidate: 10,
  }
}

function gpsLocation(text) {
  switch (text) {
    case 'bad_assert':
      return 'Bad GPS Location'
    case 'good_fix':
      return 'Good GPS Location'
    case 'no_fix':
      return 'No GPS Fix'
    default:
      return false
  }
}

export default AccountView
