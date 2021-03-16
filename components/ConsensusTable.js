import Link from 'next/link'
import { formatLocation } from './Hotspots/utils'
import { Table, Typography } from 'antd'
import animalHash from 'angry-purple-tiger'
import ReactCountryFlag from 'react-country-flag'

const { Text } = Typography

export const makeArrayWorkWithAntTable = (incomingArray) => {
  return incomingArray.map((item, index) => ({ index, address: item }))
}

export const generateColumns = (columnType) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (name, row, index) => index + 1,
    },
    {
      title: 'Hotspot Name',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link href={`/hotspots/${address}`}>
            <a style={{}}>{animalHash(address)}</a>
          </Link>
          {columnType === 'recent' && (
            <Text type="secondary" copyable>
              {address}
            </Text>
          )}
        </div>
      ),
    },
  ]

  const locationColumn = {
    title: 'Location',
    dataIndex: 'geocode',
    key: 'geocode',
    render: (geocode) => (
      <p
        style={{
          color: '#555',
        }}
        className="m-0 flex flex-row items-center justify-start"
      >
        <ReactCountryFlag
          countryCode={geocode.short_country}
          svg
          style={{
            marginRight: '6px',
          }}
        />
        {formatLocation(geocode)}
      </p>
    ),
  }
  if (columnType === 'current') columns.push(locationColumn)

  return columns
}

const ConsensusTable = ({ dataSource, columns, loading }) => {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      pagination={{
        pageSize: 16,
        showSizeChanger: false,
        hideOnSinglePage: true,
      }}
      scroll={{ x: true }}
    />
  )
}

export default ConsensusTable
