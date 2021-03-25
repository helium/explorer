import React, { useState } from 'react'
import { Table } from 'antd'
import ReactCountryFlag from 'react-country-flag'
import { Pagination } from 'antd'

const CitiesTable = ({ cities }) => {
  const PAGE_SIZE_DEFAULT = 10
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const handleTableChange = (pagination) => {
    setPageSize(pagination.pageSize)
  }
  const citiesWithIndex = cities
    .sort((a, b) =>
      a.hotspot_count < b.hotspot_count
        ? 1
        : a.hotspot_count > b.hotspot_count
        ? -1
        : 0,
    )
    .map((c, i) => ({ ...c, rank: i + 1 }))

  return (
    <>
      <div className="hidden md:block">
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
            position: ['bottomCenter'],
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </div>
      <div className="block md:hidden">
        <div className="flex flex-col px-5 mb-2">
          {citiesWithIndex.map((c, i, { length }) => {
            return (
              <div
                // TODO: clean up styles using classnames package
                className={`flex flex-col border-t border-0 border-l border-r border-solid px-3 py-2 border-gray-500 ${
                  i === 0
                    ? 'rounded-t-lg'
                    : i === length - 1
                    ? 'rounded-b-lg border-b'
                    : 'border-b-0'
                }`}
              >
                <p className="text-black text-md">
                  <span className="text-gray-800 font-semibold">
                    #{c.rank}{' '}
                  </span>
                  {c.long_city}
                </p>
                <div className="flex items-center justify-start">
                  <ReactCountryFlag countryCode={c.short_country} svg />
                  <span className="mr-2" />
                  <span className="m-0 p-0">
                    {c.long_state ? `${c.long_state}, ` : ''}
                    {c.long_country}
                  </span>
                </div>

                <div className="flex">
                  <p className="text-black font-semibold text-md">
                    {c.hotspot_count} hotspots
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <Pagination />
      </div>
    </>
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
    render: (data, row) => (
      <div className="flex items-center justify-start">
        <ReactCountryFlag countryCode={row.short_country} svg />
        <div className="mr-2" />
        <span className="m-0 p-0">{data}</span>
      </div>
    ),
  },
]

export default CitiesTable
