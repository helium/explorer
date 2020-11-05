import React, { Component } from 'react'
import AppLayout, { Content } from '../../components/AppLayout'
import { Typography, Table } from 'antd'
import Link from 'next/link'

const { Title } = Typography

function RichList({ accounts }) {
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <Link href={`/accounts/${address}`}>
          <a style={{ fontWeight: '600' }}>{address}</a>
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
      title: 'HST Balance',
      dataIndex: 'sec_balance',
      key: 'sec_balance',
      render: (sec_balance) => (
        <span>{(sec_balance / 100000000).toLocaleString(2)} HST</span>
      ),
    },
  ]

  return (
    <AppLayout>
      <Content
        style={{
          marginTop: 0,
          background: '#27284B',
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
  return {
    props: {
      accounts: await fetch('https://api.helium.io/v1/accounts/rich')
        .then((res) => res.json())
        .then(($) => $.data),
    },
    revalidate: 10,
  }
}

export default RichList
