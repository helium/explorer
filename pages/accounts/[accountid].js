import React, { useState, useEffect } from 'react'
import { Typography, Descriptions, Tooltip, Tabs } from 'antd'
import Client from '@helium/http'
import AppLayout, { Content } from '../../components/AppLayout'
import ActivityList from '../../components/ActivityList'
import HotspotsList from '../../components/HotspotsList'
import QRCode from 'react-qr-code'
import Fade from 'react-reveal/Fade'
import { Balance, CurrencyType } from '@helium/currency'
import sumBy from 'lodash/sumBy'
import HSTIcon from '../../components/Icons/HST'
import DCIcon from '../../components/Icons/DC'

import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import AccountIcon from '../../components/AccountIcon'
import AccountAddress from '../../components/AccountAddress'
import { getHotspotRewardsBuckets } from '../../data/hotspots'
import BeaconsList from '../../components/Beacons/BeaconsList'
import { getMakerName } from '../../components/Makers/utils'

const { Title } = Typography
const { TabPane } = Tabs

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
  const [hotspotsLoading, setLoadingHotspots] = useState(true)
  const [rewardsLoading, setLoadingRewards] = useState(true)

  const isMakerAccount = account.makerName !== undefined
  let makerAccountName = isMakerAccount ? account.makerName : ''

  useEffect(() => {
    async function getHotspots() {
      setLoadingHotspots(true)
      setLoadingRewards(true)

      const client = new Client()
      const accountid = account.address

      const list = await client.account(accountid).hotspots.list()
      const hotspotList = await list.take(1000)

      const hotspots = hotspotList.map((hotspot) => {
        delete hotspot.client
        return JSON.parse(JSON.stringify(hotspot))
      })

      setHotspots(hotspots)
      setLoadingHotspots(false)

      const hotspotsWithRewards = hotspots

      await Promise.all(
        hotspotsWithRewards.map(async (hotspot) => {
          const rewards = await getHotspotRewardsBuckets(
            hotspot.address,
            60,
            'day',
          )
          hotspot.rewardsSummary = {
            day: sumBy(rewards.slice(0, 1), 'total'),
            previousDay: sumBy(rewards.slice(1, 2), 'total'),
            week: sumBy(rewards.slice(0, 7), 'total'),
            previousWeek: sumBy(rewards.slice(7, 14), 'total'),
            month: sumBy(rewards.slice(0, 30), 'total'),
            previousMonth: sumBy(rewards.slice(30, 60), 'total'),
          }
          return hotspot
        }),
      )

      // add rewardsSummary to hotspots state array
      setHotspots(hotspotsWithRewards)
      setLoadingRewards(false)
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
          background: '#222e46',
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
              <AccountIcon address={account.address} size={30} />
              <Title
                level={5}
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

      <div className="w-full bg-navy-600 p-5 text-center">
        <Fade bottom delay={1000}>
          <Content style={{ maxWidth: 850, margin: '0 auto' }}>
            <div className="flex flex-col md:flex-row items-center justify-center">
              {isMakerAccount && (
                <Tooltip placement="bottom" title="This is a Maker Account">
                  <div className="mb-4 md:mb-0 mr-0 md:mr-5 flex flex-row items-center justify-start">
                    <ToolOutlined
                      style={{ color: '#A667F6', marginRight: 5 }}
                    />
                    <p className="m-0 text-white font-bold">
                      {makerAccountName}
                    </p>
                  </div>
                </Tooltip>
              )}
              <Tooltip
                placement="bottom"
                title="The amount of Data Credits this account owns."
              >
                <div className="mb-4 md:mb-0 mr-0 md:mr-5 flex flex-row items-center justify-start">
                  <DCIcon className="h-3 w-auto mr-1" />
                  <p className="text-white m-0">{dcBalanceObject.toString()}</p>
                </div>
              </Tooltip>

              <Tooltip
                placement="bottom"
                title="The amount of Security Tokens this account owns."
              >
                <div className="mb-0 flex flex-row items-center justify-start">
                  <HSTIcon className="text-pink-500 h-4 w-auto mr-1" />
                  <p className="text-white m-0">
                    {hstBalanceObject.toString(2)}
                  </p>
                </div>
              </Tooltip>
            </div>
          </Content>
        </Fade>
      </div>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 1150,
          paddingBottom: 100,
          marginTop: 0,
        }}
      >
        <Tabs
          className=""
          defaultActiveKey="1"
          centered
          style={{
            background: 'white',
          }}
        >
          <TabPane tab="Hotspots" key="1" style={{ paddingBottom: 50 }}>
            <HotspotsList
              rewardsLoading={rewardsLoading}
              hotspotsLoading={hotspotsLoading}
              hotspots={hotspots}
            />
          </TabPane>
          <TabPane tab="Beacons" key="2" style={{ paddingBottom: 50 }}>
            <BeaconsList type="account" address={account.address} />
          </TabPane>
          <TabPane tab="Activity" key="3" style={{ paddingBottom: 50 }}>
            <ActivityList
              type="account"
              address={account.address}
              hotspots={hotspots}
            />
          </TabPane>
        </Tabs>
      </Content>
    </AppLayout>
  )
}

export async function getServerSideProps({ params }) {
  const client = new Client()
  const { accountid } = params

  let account
  let makerName
  try {
    account = await client.accounts.get(accountid)
    makerName = await getMakerName(account.address)
    if (makerName !== 'Unknown Maker') account.makerName = makerName
  } catch (e) {
    if (e.response.status === 404) {
      // serve the 404 page if it's a 404 error, otherwise it'll throw the appropriate server error
      return { notFound: true }
    }
    throw e
  }
  return {
    props: {
      account: JSON.parse(JSON.stringify(account)),
    },
  }
}

export default AccountView
