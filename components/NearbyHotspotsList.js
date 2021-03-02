import React, { useState } from 'react'
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
    dataIndex: 'dist',
    key: 'dist',
    render: (dist) => <span>{formatDistance(dist)}</span>,
  },
]

const NearbyHotspotsList = ({ nearbyHotspots, nearbyHotspotsLoading }) => {
  const PAGE_SIZE_DEFAULT = 5
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)

  const handleTableChange = (pagination, filter, sorter) => {
    setPageSize(pagination.pageSize)
  }
  return (
    <Card
      title={`Nearby Hotspots${
        !nearbyHotspotsLoading ? ` (${nearbyHotspots.length})` : ''
      }`}
    >
      {nearbyHotspots.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            marginTop: '0.5rem',
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.25)',
            padding: '20px',
          }}
        >
          Hotspot has no nearby hotspots (within 2km)
        </p>
      ) : (
        <span className="ant-table-styling-override">
          <Table
            dataSource={nearbyHotspots}
            columns={columns}
            size="small"
            loading={nearbyHotspotsLoading}
            rowKey="name"
            pagination={{
              pageSize,
              showSizeChanger: nearbyHotspots.length > PAGE_SIZE_DEFAULT,
              hideOnSinglePage: nearbyHotspots.length <= PAGE_SIZE_DEFAULT,
              pageSizeOptions: [5, 10, 20, 50, 100],
              position: 'bottomCenter',
            }}
            scroll={{ x: true }}
            onChange={handleTableChange}
          />
        </span>
      )}
    </Card>
  )
}

export default NearbyHotspotsList
