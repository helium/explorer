import React, { useState } from 'react'
import { Card, Table, Tooltip } from 'antd'
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
          <a style={{ fontFamily: "'inter', sans-serif" }}>
            {formatHotspotName(name)}
          </a>
        </Link>
      </>
    ),
  },
  {
    title: 'Location',
    dataIndex: ['location', 'geocode'],
    key: 'location',
    render: (data) => (
      <span>{formatLocation(data.location, data.geocode)}</span>
    ),
  },
  {
    title: 'Transmit Scale',
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

const WitnessesList = ({ witnesses, witnessesLoading }) => {
  const PAGE_SIZE_DEFAULT = 5
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)

  const handleTableChange = (pagination, filter, sorter) => {
    setPageSize(pagination.pageSize)
  }

  return (
    <Card
      title={
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          Recent Witnesses{!witnessesLoading ? ` (${witnesses.length})` : ''}
          <Tooltip placement="top" title={'Witnesses from the last 5 days'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                color: '#999',
                height: 18,
                width: 18,
                marginLeft: 10,
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Tooltip>
        </span>
      }
    >
      {witnesses.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            marginTop: '0.5rem',
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.25)',
            padding: '20px',
          }}
        >
          Hotspot has no recent witnesses
        </p>
      ) : (
        <span className="ant-table-styling-override">
          <Table
            dataSource={witnesses}
            columns={columns}
            size="small"
            loading={witnessesLoading}
            rowKey="name"
            pagination={{
              pageSize,
              showSizeChanger: witnesses.length > PAGE_SIZE_DEFAULT,
              hideOnSinglePage: witnesses.length <= PAGE_SIZE_DEFAULT,
              pageSizeOptions: [5, 10, 20, 50, 100],
            }}
            scroll={{ x: true }}
            onChange={handleTableChange}
          />
        </span>
      )}
    </Card>
  )
}

export default WitnessesList
