import React, { useState } from 'react'
import { Card, Table, Tooltip } from 'antd'
import Link from 'next/link'
import { StatusCircle } from './Hotspots'
import { formatDistance, formatNearbyLocation } from './Hotspots/utils'
import animalHash from 'angry-purple-tiger'
import InfoIcon from '../components/Icons/Info'

const columns = [
  {
    title: 'Hotspot',
    dataIndex: 'address',
    key: 'address',
    render: (address, row) => (
      <>
        <StatusCircle status={row.status} />
        <Link href={'/hotspots/' + address} prefetch={false}>
          <a style={{ fontFamily: "'Inter', sans-serif" }}>
            {animalHash(address)}
          </a>
        </Link>
      </>
    ),
  },
  {
    title: 'Location',
    dataIndex: 'geocode',
    key: 'location',
    render: (data) => <span>{formatNearbyLocation(data)}</span>,
  },
  {
    title: 'Reward Scale',
    dataIndex: 'reward_scale',
    key: 'reward_scale',
    render: (data) => (
      <span>
        {data
          ? data.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })
          : ''}
      </span>
    ),
  },
  {
    title: 'Distance',
    dataIndex: 'distanceAway',
    key: 'distanceAway',
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
      title={
        <span className="flex items-center justify-start">
          Nearby Hotspots
          {!nearbyHotspotsLoading ? ` (${nearbyHotspots.length})` : ''}
          <Tooltip
            placement="top"
            title={'Hotspots within 2 km of this Hotspot'}
          >
            <div className="flex items-center justify-center ml-2">
              <InfoIcon className="text-gray-600 h-5 w-5" />
            </div>
          </Tooltip>
        </span>
      }
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
          {nearbyHotspotsLoading
            ? 'Nearby hotspots are loading'
            : 'Hotspot has no nearby hotspots (within 2km)'}
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
