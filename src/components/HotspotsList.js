import React, { Component } from 'react'
import { Row, Col, Table, Card } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'

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
      hotspots.push(hotspot)
    }

    this.setState({ hotspots, loading: false })
  }

  render() {
    const { hotspots, loading } = this.state
    return (
      <Row gutter={8} style={{ marginTop: 20 }}>
        <Col xs={16} offset={4}>
          <Card loading={loading} title={'Hotspots'}>
            <Table
              dataSource={hotspots}
              columns={hotspotColumns}
              size="small"
              rowKey="name"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    )
  }
}

const hotspotColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (data, row) => <a href={'/hotspots/' + row.address}>{data}</a>,
  },
  {
    title: 'Location',
    dataIndex: 'geocode',
    key: 'location',
    render: (data) => <span>{data.longCity}, {data.shortState}</span>,
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    render: (data) => round(data, 2)
  },
]

export default HotspotsList
