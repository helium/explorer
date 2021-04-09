import React, { Component } from 'react'
import { Table } from 'antd'
import { TxnTag } from '.'
import Link from 'next/link'
import AccountIcon from '../AccountIcon'
import { Balance, CurrencyType } from '@helium/currency'

const columns = [
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    render: (address) => (
      <div style={{ display: 'flex' }}>
        <AccountIcon address={address} style={{ marginRight: 4 }} />
        <Link href={'/accounts/' + address} prefetch={false}>
          <a>{address}</a>
        </Link>
      </div>
    ),
  },
  {
    title: 'Rewards',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: 'Total HNT',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => <span>{amount.toString()} HNT</span>,
  },
]

const expandedColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    render: (type) => <TxnTag type={type}></TxnTag>,
  },
  {
    title: 'HNT mined',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => {
      const amountObject = new Balance(
        amount.integerBalance,
        CurrencyType.networkToken,
      )
      return <span>{amountObject.toString(2)}</span>
    },
  },
]

class RewardsV1 extends Component {
  state = {
    groupedRewards: [],
    expandedTable: {
      expandedRowRender: (record) => (
        <span className="ant-table-override">
          <Table
            pagination={{ pageSize: 50 }}
            size="small"
            columns={expandedColumns}
            dataSource={record.rewards}
          />
        </span>
      ),
    },
  }

  componentDidMount() {
    const { txn } = this.props
    const { groupedRewards } = this.state

    txn.rewards.forEach((r) => {
      const val = { account: r.account }
      val['rewards'] = txn.rewards.filter((obj) => {
        return obj.account === r.account
      })
      if (
        groupedRewards.filter((e) => e.account === val.account).length === 0
      ) {
        val['count'] = val.rewards.length
        let amount = 0
        val.rewards.forEach((r) => {
          amount += r.amount.integerBalance / 100000000
        })
        val['amount'] = amount.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
        groupedRewards.push(val)
      }
    })
    groupedRewards.sort((b, a) =>
      a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0,
    )
    this.setState({ groupedRewards: [...groupedRewards] })
  }

  render() {
    const { groupedRewards, expandedTable } = this.state

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
          dataSource={groupedRewards}
          columns={columns}
          size="small"
          rowKey="account"
          pagination={{ pageSize: 50 }}
          scroll={{ x: true }}
          expandable={expandedTable}
        />
      </div>
    )
  }
}

export default RewardsV1
