import React, { Component } from 'react'
import { Table, Card } from 'antd';
import Timestamp from 'react-timestamp';

class BlocksList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      blocks: [],
      loading: true,
    }
  }

  componentDidMount() {
    this.loadBlocks()
  }

  async getCursors(blocks, cursor) {
    const cc = await (await fetch("https://api.helium.io/v1/blocks?cursor=" + cursor)).json()
    blocks.push(...cc.data)
    if (blocks.length > 100) { return } //probably dont need more than 200+ blocks for now
    if (cc.cursor) {
      await this.getCursors(blocks, cc.cursor)
    }
  }

  async loadBlocks() {
    let { loading, blocks } = this.state
    const b = await (await fetch("https://api.helium.io/v1/blocks")).json()
    blocks.push(...b.data)
    if (b.cursor) { 
      await this.getCursors(blocks, b.cursor)
    }
    loading = false    
    this.setState({ blocks, loading })
  }

  render() {
    const { blocks, loading } = this.state;

    const columns = [
      {
        title: 'Height',
        dataIndex: 'height',
        key: 'height',
        render: height => <span style={{fontWeight: 'bold'}}>{height}</span>          
      },
      {
        title: 'Timestamp',
        dataIndex: 'time',
        key: 'time',
        render: time => <Timestamp date={time} />
      },
      {
        title: 'Transactions',
        dataIndex: 'transaction_count',
        key: 'transaction_count',
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: hash => <a href={'/blocks/' + hash}>{hash}</a>
      }
    ]

    return (
      <div>
          <Card>
            <Table dataSource={blocks} columns={columns} rowKey="hash" pagination={{ pageSize: 50 }} loading={loading}/>
          </Card>
      </div>
    )
  }
}

export default BlocksList
