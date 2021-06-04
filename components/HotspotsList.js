import React, { useState } from 'react'
import { Table, Card } from 'antd'
import { Content } from './AppLayout'
import Link from 'next/link'
import { formatHotspotName, formatLocation } from './Hotspots/utils'
import { StatusCircle } from './Hotspots'
import HotspotRewardsRow from './Hotspots/HotspotRewardsRow'

const HotspotsList = ({ hotspots, rewardsLoading, hotspotsLoading }) => {
  const hotspotColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (data, row) => (
        <>
          <StatusCircle status={row.status} />
          <Link href={'/hotspots/' + row.address} prefetch={false}>
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
      title: 'Transmit Scale',
      dataIndex: 'rewardScale',
      key: 'rewardScale',
      render: (data) => {
        if (data) {
          return (
            <span>
              {data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          )
        } else {
          return <span>Not set</span>
        }
      },
    },
    {
      title: 'Rewards (24h)',
      dataIndex: 'rewardsSummary',
      key: 'rewardsDay',
      render: (data) => (
        <HotspotRewardsRow
          data={data}
          rewardsLoading={rewardsLoading}
          period="day"
        />
      ),
    },
    {
      title: 'Rewards (7d)',
      dataIndex: 'rewardsSummary',
      key: 'rewardsWeek',
      render: (data) => (
        <HotspotRewardsRow
          data={data}
          rewardsLoading={rewardsLoading}
          period="week"
        />
      ),
    },
    {
      title: 'Rewards (30d)',
      dataIndex: 'rewardsSummary',
      key: 'rewardsMonth',
      render: (data) => (
        <HotspotRewardsRow
          data={data}
          rewardsLoading={rewardsLoading}
          period="month"
        />
      ),
    },
  ]

  const PAGE_SIZE_DEFAULT = 10
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const handleTableChange = (pagination, filter, sorter) => {
    setPageSize(pagination.pageSize)
  }

  return (
    <Content style={{ marginBottom: 20 }}>
      <Card
        loading={hotspotsLoading}
        title={`Hotspots${!hotspotsLoading ? ` (${hotspots.length})` : ''}`}
      >
        {hotspots.length == 0 ? (
          <p
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.25)',
              padding: '20px',
            }}
          >
            Account has no hotspots
          </p>
        ) : (
          <span className="ant-table-styling-override">
            <Table
              dataSource={hotspots}
              columns={hotspotColumns}
              loading={hotspotsLoading}
              size="small"
              rowKey="name"
              pagination={{
                pageSize,
                showSizeChanger: hotspots.length > PAGE_SIZE_DEFAULT,
                hideOnSinglePage: hotspots.length <= PAGE_SIZE_DEFAULT,
                pageSizeOptions: [5, 10, 20, 50, 100],
              }}
              scroll={{ x: true }}
              onChange={handleTableChange}
            />
          </span>
        )}
      </Card>
    </Content>
  )
}

export default HotspotsList
