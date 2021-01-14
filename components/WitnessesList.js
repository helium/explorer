import React from 'react'
import { Card, Table, Skeleton } from 'antd'
import Link from 'next/link'
import { formatHotspotName, formatLocation } from './Hotspots/utils'
import { StatusCircle } from './Hotspots'

const columns = [
  {
    title: 'Hotspot',
    dataIndex: 'name',
    key: 'name',
    render: (name, row) => (
      <>
        <StatusCircle status={row.status} />
        <Link href={'/hotspots/' + row.address} prefetch={false}>
          <a style={{ fontFamily: 'soleil, sans-serif' }}>
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
    title: 'RSSI',
    dataIndex: 'witness_info',
    key: 'rssi',
    render: (data) => (
      <span>
        {Object.keys(data.histogram).reduce((a, b) =>
          data.histogram[a] > data.histogram[b] ? a : b,
        )}{' '}
        dBm
      </span>
    ),
  },
]

const WitnessesList = ({ witnesses, witnessesLoading }) => (
  <Card title={'Witnesses'}>
    <Table
      dataSource={witnesses}
      columns={columns}
      size="small"
      loading={witnessesLoading}
      rowKey="name"
      pagination={{ pageSize: 5, hideOnSinglePage: true }}
      scroll={{ x: true }}
    />
  </Card>
)

export default WitnessesList
