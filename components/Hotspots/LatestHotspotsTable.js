import React from 'react'
import { Table } from 'antd'
import Link from 'next/link'
import { formatHotspotName, formatLocation } from './utils'
import { StatusCircle } from './'

const LatestHotspotsTable = ({ hotspots }) => (
  <Table
    dataSource={hotspots}
    columns={hotspotColumns}
    size="small"
    rowKey="name"
    pagination={{ pageSize: 5, hideOnSinglePage: true }}
    scroll={{ x: true }}
  />
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
    title: 'Added Block',
    dataIndex: 'blockAdded',
    key: 'blockAdded',
  },
]

export default LatestHotspotsTable
