import React from 'react'
import { Card, Table } from 'antd'
import Link from 'next/link'
import { StatusCircle } from './Hotspots'
import {
  formatDistance,
  formatHotspotName,
  formatLocation,
} from './Hotspots/utils'

const columns = [
  {
    title: 'Hotspot',
    dataIndex: 'name',
    key: 'name',
    render: (name, row) => (
      <>
        <StatusCircle status={row.status} />
        <Link href={'/hotspots/' + row.address} prefetch={false}>
          <a style={{ fontFamily: "'Inter', sans-serif" }}>
            {formatHotspotName(name)}
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
    title: 'Distance',
    dataIndex: '_rankingInfo',
    key: 'distance',
    render: ({ geoDistance: distance }) => (
      <span>{formatDistance(distance)}</span>
    ),
  },
]

const NearbyHotspotsList = ({ nearbyHotspots, nearbyHotspotsLoading }) => (
  <Card title={'Nearby Hotspots'}>
    <Table
      dataSource={nearbyHotspots}
      columns={columns}
      size="small"
      loading={nearbyHotspotsLoading}
      rowKey="name"
      pagination={{ pageSize: 5, hideOnSinglePage: true }}
      scroll={{ x: true }}
    />
  </Card>
)

export default NearbyHotspotsList
