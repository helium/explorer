import React, { useState } from 'react'
import { Table } from 'antd'
import ReactCountryFlag from 'react-country-flag'
import { Pagination } from 'antd'
import classNames from 'classnames'

const CitiesTable = ({ cities, topCities, topCitiesTotal }) => {
  const PAGE_SIZE_DEFAULT = 10
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const handleTableChange = (pagination) => {
    setPageSize(pagination.pageSize)
  }
  const citiesToDisplay = topCities
    .sort((a, b) =>
      a.hotspotCount < b.hotspotCount
        ? 1
        : a.hotspotCount > b.hotspotCount
        ? -1
        : 0,
    )
    .slice(0, 100)
    .map((c, i) => ({ ...c, rank: i + 1 }))

  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastPost = currentPage * pageSize
  const indexOfFirstPost = indexOfLastPost - pageSize
  const currentPageOfCities = citiesToDisplay.slice(
    indexOfFirstPost,
    indexOfLastPost,
  )

  return (
    <>
      <div className="hidden md:block">
        <Table
          dataSource={citiesToDisplay}
          columns={citiesColumns}
          size="small"
          rowKey="id"
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
          {currentPageOfCities.map((c, i, { length }) => {
            return (
              <div
                className={classNames(
                  'relative flex flex-col border-t border-0 border-l border-r border-solid border-gray-500',
                  {
                    'rounded-t-lg': i === 0,
                    'rounded-b-lg border-b': i === length - 1,
                    'border-b-0': i !== 0 && i !== length - 1,
                  },
                )}
              >
                <div
                  className={classNames(
                    'absolute top-0 bottom-0 w-14 flex items-center justify-center bg-purple-700',
                    {
                      'rounded-tl-lg': i === 0,
                      'rounded-bl-lg': i === length - 1,
                    },
                  )}
                >
                  <span className="text-white font-normal">{c.rank}</span>
                </div>
                <div className="pl-14">
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-start">
                      <ReactCountryFlag countryCode={c.shortCountry} svg />
                      <span className="mr-2" />
                      <p className="text-black text-md font-semibold m-0 p-0">
                        {c.longCity}
                        <span className="m-0 p-0 font-normal text-gray-600">
                          , {c.longCountry}
                        </span>
                      </p>
                    </div>
                    <p className="text-purple-700 font-semibold text-md m-0 p-0">
                      {c.hotspotCount?.toLocaleString()} hotspots
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center mt-5">
          <Pagination
            current={currentPage}
            showSizeChanger
            size="small"
            total={citiesToDisplay.length}
            pageSize={pageSize}
            onChange={(page, pageSize) => {
              setCurrentPage(page)
              setPageSize(pageSize)
            }}
          />
        </div>
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
    dataIndex: 'hotspotCount',
    key: 'hotspotCount',
    render: (data) => (
      <span className="text-purple-500 font-semibold">{data}</span>
    ),
  },
  {
    title: 'City',
    dataIndex: 'longCity',
    key: 'longCity',
    render: (data) => <span>{data}</span>,
  },
  {
    title: 'Region',
    dataIndex: 'longState',
    key: 'longState',
    render: (data) => <span>{data}</span>,
  },
  {
    title: 'Country',
    dataIndex: 'longCountry',
    key: 'longCountry',
    render: (data, row) => (
      <div className="flex items-center justify-start">
        <ReactCountryFlag countryCode={row.shortCountry} svg />
        <div className="mr-2" />
        <span className="m-0 p-0">{data}</span>
      </div>
    ),
  },
]

export default CitiesTable
