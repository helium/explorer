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
      title: 'Reward Scale',
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

  const [pageSize, setPageSize] = useState(5)
  const handleTableChange = (pagination, filter, sorter) => {
    setPageSize(pagination.pageSize)
  }

  return (
    <Content style={{ marginBottom: 20 }}>
      <Card loading={hotspotsLoading} title={'Hotspots'}>
        {hotspots.length == 0 ? (
          <h2
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.25)',
              padding: '20px',
            }}
          >
            Account has no hotspots
          </h2>
        ) : (
          <Table
            dataSource={hotspots}
            columns={hotspotColumns}
            loading={hotspotsLoading}
            size="small"
            rowKey="name"
            pagination={{ pageSize }}
            scroll={{ x: true }}
            onChange={handleTableChange}
          />
        )}
      </Card>
    </Content>
  )
}

export default HotspotsList
