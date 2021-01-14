import React from 'react'
import AppLayout, { Content } from '../../components/AppLayout'
import { Typography, Table } from 'antd'
import Link from 'next/link'
import AccountIcon from '../../components/AccountIcon'
import AccountAddress from '../../components/AccountAddress'

const { Title } = Typography

function RichList({ accounts }) {
  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank) => (
        <span style={{ display: 'block', textAlign: 'center' }}>{rank}</span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <Link href={`/accounts/${address}`}>
          <span style={{ display: 'flex' }}>
            <AccountIcon address={address} size={24} />
            <a style={{ fontWeight: '600', marginLeft: 6 }}>
              <AccountAddress address={address} truncate />
            </a>
          </span>
        </Link>
      ),
    },
    {
      title: 'HNT Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => (
        <span>{(balance / 100000000).toLocaleString(2)} HNT</span>
      ),
    },
    {
      title: 'HNT Ratio',
      dataIndex: 'hntPercent',
      key: 'hntPercent',
      render: (hntPercent) => <span>{hntPercent.toLocaleString(2)}%</span>,
    },
    {
      title: 'HST Balance',
      dataIndex: 'sec_balance',
      key: 'sec_balance',
      render: (sec_balance) => (
        <span>{(sec_balance / 100000000).toLocaleString(2)} HST</span>
      ),
    },
    {
      title: 'HST Ratio',
      dataIndex: 'hstPercent',
      key: 'hstPercent',
      render: (hstPercent) => <span>{hstPercent.toLocaleString(2)}%</span>,
    },
  ]

  return (
    <AppLayout
      title={'Richest Accounts'}
      description={
        'The accounts on the Helium blockchain with the largest balances of HNT and HST'
      }
      url={`https://explorer.helium.com/accounts/richest`}
    >
      <Content
        style={{
          marginTop: 0,
          background: 'rgb(16, 23, 37)',
          padding: '60px 0 20px',
        }}
      >
        <div style={{ margin: '0 auto', maxWidth: 850 }}>
          <div className="flexwrapper">
            <Title
              style={{
                margin: '0px 0 40px',
                maxWidth: 550,
                letterSpacing: '-2px',
                fontSize: 38,
                lineHeight: 1,
                color: 'white',
              }}
            >
              Rich <span style={{ fontWeight: 300 }}>List</span>
            </Title>
          </div>
        </div>
      </Content>

      <Content
        style={{
          margin: '0 auto',
          maxWidth: 850,
          paddingBottom: 100,
        }}
      >
        <div style={{ background: 'white', padding: 15 }}>
          <h2 style={{ marginTop: 20 }}>Accounts</h2>
        </div>
        <Table
          dataSource={accounts}
          columns={columns}
          rowKey="hash"
          pagination={false}
          scroll={{ x: true }}
        />
      </Content>
    </AppLayout>
  )
}

export async function getStaticProps() {
  const [accounts, stats] = await Promise.all([
    fetch('https://api.helium.io/v1/accounts/rich')
      .then((res) => res.json())
      .then(($) => $.data),
    fetch('https://api.helium.io/v1/stats')
      .then((res) => res.json())
      .then(($) => $.data),
  ])

  const augmentedAccounts = accounts.map((a, i) => {
    return {
      rank: i + 1,
      hntPercent: (a.balance / 100000000 / stats.token_supply) * 100,
      hstPercent: (a.sec_balance / 1000000000000) * 100,
      ...a,
    }
  })

  return {
    props: {
      accounts: augmentedAccounts,
    },
    revalidate: 10,
  }
}

export default RichList
