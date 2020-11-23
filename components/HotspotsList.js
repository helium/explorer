import React from 'react'
import { Table, Card } from 'antd'
import round from 'lodash/round'
import { Content } from './AppLayout'
import Link from 'next/link'
import { formatHotspotName, formatLocation } from './Hotspots/utils'
import { StatusCircle } from './Hotspots'

const HotspotsList = ({ hotspots, loading = false }) => (
  <Content style={{ marginBottom: 20 }}>
    <Card loading={loading} title={'Hotspots'}>
      <Table
        dataSource={hotspots}
        columns={hotspotColumns}
        size="small"
        rowKey="name"
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: true }}
      />
    </Card>
  </Content>
)

const hotspotColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (data, row) => (
      <>
        <StatusCircle status={row.status} />
        <Link href={'/hotspots/' + row.address}>
          <a style={{ fontFamily: 'soleil, sans-serif' }}>
            {formatHotspotName(data)}
          </a>
        </Link>
      </>
    ),
  },
  {
    title: 'Location',
    dataIndex: 'geocode',
    key: 'location',
    render: (data) => <span>{formatLocation(data)}</span>,
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    render: (data) => round(data, 2),
  },
]

export default HotspotsList
