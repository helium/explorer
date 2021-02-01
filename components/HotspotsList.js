import React from 'react'
import { Table, Card, Tooltip } from 'antd'
import round from 'lodash/round'
import { Content } from './AppLayout'
import Link from 'next/link'
import {
  formatHotspotName,
  formatLocation,
  calculatePercentChange,
  formatPercentChangeString,
} from './Hotspots/utils'
import { StatusCircle } from './Hotspots'

const HotspotsList = ({ hotspots, loading }) => {
  return (
    <Content style={{ marginBottom: 20 }}>
      <Card loading={loading} title={'Hotspots'}>
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
            loading={loading}
            size="small"
            rowKey="name"
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            scroll={{ x: true }}
          />
        )}
      </Card>
    </Content>
  )
}

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
    title: 'Rewards (24h)',
    dataIndex: 'rewards',
    key: 'rewardsDay',
    render: (data) => {
      const percentChange = calculatePercentChange(data.day, data.previousDay)
      return (
        <span>
          {round(data.day, 2)}
          <Tooltip title={`Previous day: ${round(data.previousDay, 2)} HNT`}>
            <span
              style={{
                marginLeft: 5,
                color: percentChange > 0 ? '#32C48D' : '#CA0926',
              }}
            >
              {formatPercentChangeString(percentChange)}
            </span>
          </Tooltip>
        </span>
      )
    },
  },
  {
    title: 'Rewards (7d)',
    dataIndex: 'rewards',
    key: 'rewardsWeek',
    render: (data) => {
      const percentChange = calculatePercentChange(data.week, data.previousWeek)
      return (
        <span>
          {round(data.week, 2)}
          <Tooltip title={`Previous week: ${round(data.previousWeek, 2)} HNT`}>
            <span
              style={{
                marginLeft: 5,
                color: percentChange > 0 ? '#32C48D' : '#CA0926',
              }}
            >
              {formatPercentChangeString(percentChange)}
            </span>
          </Tooltip>
        </span>
      )
    },
  },
  {
    title: 'Rewards (30d)',
    dataIndex: 'rewards',
    key: 'rewardsMonth',
    render: (data) => {
      const percentChange = calculatePercentChange(
        data.month,
        data.previousMonth,
      )
      return (
        <span>
          {round(data.month, 2)}
          <Tooltip
            title={`Previous month: ${round(data.previousMonth, 2)} HNT`}
          >
            <span
              style={{
                marginLeft: 5,
                color: percentChange > 0 ? '#32C48D' : '#CA0926',
              }}
            >
              {formatPercentChangeString(percentChange)}
            </span>
          </Tooltip>
        </span>
      )
    },
  },
]

export default HotspotsList
