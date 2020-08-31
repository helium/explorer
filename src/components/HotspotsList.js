import React, { Component } from 'react'
import { Table, Card } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import { Content } from './AppLayout'

const initialState = {
  hotspots: [],
  loading: true,
}

class HotspotsList extends Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.loadData()
    }
  }

  loadData = async () => {
    const { address } = this.props
    await this.setState(initialState)
    const list = await this.client.account(address).hotspots.list()
    const hotspots = []
    for await (const hotspot of list) {
      hotspot.status.gpsText = this.gpsLocation(hotspot.status.gps)
      hotspots.push(hotspot)
    }

    this.setState({ hotspots, loading: false })
  }

  gpsLocation = (text) => {
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

  render() {
    const { hotspots, loading } = this.state
    return (
      <Content style={{ marginBottom: 20 }}>
        <Card loading={loading} title={'Hotspots'}>
          <Table
            dataSource={hotspots}
            columns={hotspotColumns}
            size="small"
            rowKey="name"
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
          />
        </Card>
      </Content>
    )
  }
}

const hotspotColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (data, row) => (
      <a
        style={{ fontFamily: 'soleil, sans-serif' }}
        href={'/hotspots/' + row.address}
      >
        {data}
      </a>
    ),
  },
  {
    title: 'Location',
    dataIndex: 'geocode',
    key: 'location',
    render: (data) => (
      <span>
        {data.longCity}, {data.shortState}
      </span>
    ),
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    render: (data) => round(data, 2),
  },
]

export default HotspotsList
