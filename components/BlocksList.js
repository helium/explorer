import React, { Component } from 'react'
import { Table, Typography } from 'antd'
import Timestamp from 'react-timestamp'
import Client from '@helium/http'
import LoadMoreButton from './LoadMoreButton'
const { Text } = Typography
import Link from 'next/link'

class BlocksList extends Component {
  state = {
    blocks: [],
    loading: true,
  }

  async componentDidMount() {
    const client = new Client()
    this.list = await client.blocks.list()
    this.loadBlocks()
  }

  loadBlocks = async () => {
    this.setState({ loading: true })
    const { blocks } = this.state
    const newBlocks = await this.list.take(20)
    this.setState({ blocks: [...blocks, ...newBlocks], loading: false })
  }

  render() {
    const { blocks, loading } = this.state

    const columns = [
      {
        title: 'Height',
        dataIndex: 'height',
        key: 'height',
        render: (height) => (
          <Link href={`/blocks/${height}`}>
            <a style={{ fontWeight: '600' }}>{height.toLocaleString()}</a>
          </Link>
        ),
      },
      {
        title: 'Timestamp',
        dataIndex: 'time',
        key: 'time',
        render: (time) => <Timestamp date={time} />,
      },
      {
        title: 'Transactions',
        dataIndex: 'transactionCount',
        key: 'transaction_count',
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: (hash) => <Text code>{hash}</Text>,
      },
    ]

    return (
      <>
        <Table
          dataSource={blocks}
          columns={columns}
          rowKey="hash"
          pagination={false}
          loading={loading}
          scroll={{ x: true }}
          size="small"
        />
        <LoadMoreButton onClick={this.loadBlocks} />
      </>
    )
  }
}

export default BlocksList
