import React, { Component } from 'react'
import { Table, Descriptions } from 'antd'
import Client from '@helium/http'
import animalHash from 'angry-purple-tiger'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const SCCloseMapbox = dynamic(() => import('../components/SCCloseMapbox'), {
  ssr: false,
  loading: () => <div />,
})

class TxnSCClose extends Component {
  state = {
    totalPackets: 0,
    totalHotspots: 0,
    totalDcs: 0,
    totalBytes: 0,
    columns: [
      {
        title: 'Hotspot',
        dataIndex: 'client',
        key: 'client',
        render: (data) => (
          <span>
            <Link href={'/hotspots/' + data}>
              <a>{animalHash(data)}</a>
            </Link>
          </span>
        ),
      },
      {
        title: 'Packets Sent',
        dataIndex: 'num_packets',
        key: 'num_packets',
        render: (data) => <span>{data.toLocaleString()}</span>,
      },
      {
        title: 'Data Sent',
        dataIndex: 'num_bytes',
        key: 'num_bytes',
        render: (data) => <span>{this.formatBytes(data)}</span>,
      },
      {
        title: 'Data Credits',
        dataIndex: 'num_dcs',
        key: 'num_dcs',
        render: (data) => <span>{data.toLocaleString()}</span>,
      },
    ],
    data: [],
    hotspots: [],
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  componentDidMount() {
    this.tallyValues()
    this.client = new Client()
    this.loadData()
  }

  async loadData() {
    const list = await this.client.hotspots.list()
    const allSpots = await list.take(20000)
    this.setState({ hotspots: allSpots })
  }

  tallyValues() {
    const { txn } = this.props
    let { totalPackets, totalHotspots, totalDcs, totalBytes, data } = this.state
    txn.stateChannel.summaries.forEach((s) => {
      totalPackets += s.num_packets
      totalDcs += s.num_dcs
      totalBytes += s.num_dcs * 24
      data.push({
        client: s.client,
        num_packets: s.num_packets,
        num_dcs: s.num_dcs,
        num_bytes: s.num_dcs * 24,
      })
    })
    data.sort((b, a) =>
      a.num_dcs > b.num_dcs ? 1 : b.num_dcs > a.num_dcs ? -1 : 0,
    )
    totalHotspots = txn.stateChannel.summaries.length
    this.setState({
      totalPackets,
      totalDcs,
      totalHotspots,
      totalBytes,
      data: [...data],
    })
  }

  render() {
    const { txn } = this.props
    const {
      hotspots,
      totalPackets,
      totalDcs,
      totalBytes,
      totalHotspots,
      columns,
      data,
    } = this.state

    return (
      <div>
        <SCCloseMapbox hotspots={hotspots} txn={txn} />

        <Descriptions bordered>
          <Descriptions.Item label="Block Height" span={3}>
            <Link href={'/blocks/' + txn.height}>
              <a>{txn.height}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Total Packets" span={3}>
            {totalPackets.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Total Data" span={3}>
            {this.formatBytes(totalBytes)}
          </Descriptions.Item>
          <Descriptions.Item label="Data Credits Spent" span={3}>
            {totalDcs.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Number of Hotspots" span={3}>
            {totalHotspots.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="State Channel Closer" span={3}>
            <Link href={'/accounts/' + txn.closer}>
              <a>{txn.closer}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="State Channel Owner" span={3}>
            <Link href={'/accounts/' + txn.stateChannel.owner}>
              <a>{txn.stateChannel.owner}</a>
            </Link>
          </Descriptions.Item>
        </Descriptions>

        <Table
          dataSource={data}
          columns={columns}
          style={{ marginTop: '10px' }}
          pagination={false}
        />
      </div>
    )
  }
}

export default TxnSCClose
