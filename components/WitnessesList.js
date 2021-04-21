import React, { useState } from 'react'
import { Card, Table, Tooltip } from 'antd'
import Link from 'next/link'
import { formatHotspotName, formatNearbyLocation } from './Hotspots/utils'
import { StatusCircle } from './Hotspots'
import InfoIcon from '../components/Icons/Info'

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
        <span className="flex items-center justify-start">
          Recent Witnesses{!witnessesLoading ? ` (${witnesses.length})` : ''}
          <Tooltip placement="top" title={'Witnesses from the last 5 days'}>
            <div className="flex items-center justify-center ml-2">
              <InfoIcon className="text-gray-600 h-5 w-5" />
            </div>
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
          {witnessesLoading
            ? 'Witnesses are loading'
            : 'Hotspot has no recent witnesses'}
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
