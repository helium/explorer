import React, { useState } from 'react'
import { Table } from 'antd'

const CitiesTable = ({ cities }) => {
  const PAGE_SIZE_DEFAULT = 10
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const handleTableChange = (pagination) => {
    setPageSize(pagination.pageSize)
  }
  const citiesWithIndex = cities.map((c, i) => ({ ...c, rank: i + 1 }))
  return (
    <Table
      dataSource={citiesWithIndex}
      columns={citiesColumns}
      size="small"
      rowKey="city_id"
      pagination={{
        pageSize,
        showSizeChanger: cities.length > PAGE_SIZE_DEFAULT,
        hideOnSinglePage: cities.length <= PAGE_SIZE_DEFAULT,
        pageSizeOptions: [5, 10, 20, 50, 100],
        position: 'bottomCenter',
      }}
      onChange={handleTableChange}
      scroll={{ x: true }}
    />
  )
}

const citiesColumns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    render: (data) => <span>{data}</span>,
  },
  {
    title: '# Hotspots Deployed',
    dataIndex: 'hotspot_count',
    key: 'hotspot_count',
    render: (data) => <span>{data}</span>,
  },
  {
    title: 'City',
    dataIndex: 'long_city',
    key: 'long_city',
    render: (data) => <span>{data}</span>,
  },
  {
    title: 'Region',
    dataIndex: 'long_state',
    key: 'long_state',
    render: (data) => <span>{data}</span>,
  },
  {
    title: 'Country',
    dataIndex: 'long_country',
    key: 'long_country',
    render: (data) => <span>{data}</span>,
  },
]

export default CitiesTable
