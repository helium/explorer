import React, { Component } from 'react'
import Client, { Network } from '@helium/http'
import { Table, Card, Button, Tooltip, Checkbox, Typography } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import Timestamp from 'react-timestamp'
import { TxnTag } from './Txns'
import LoadMoreButton from './LoadMoreButton'
import { Content } from './AppLayout'
import ExportCSV from './ExportCSV'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import dynamic from 'next/dynamic'
import FlagLocation from '../components/Common/FlagLocation'
import BeaconRow from '../components/Beacons/BeaconRow'
import BeaconLabel from '../components/Beacons/BeaconLabel'
import WitnessesTable from '../components/Beacons/WitnessesTable'
import { h3ToGeo } from 'h3-js'
import { calculateDistance, formatDistance } from '../utils/distance'
const { Text } = Typography
import classNames from 'classnames'

const initialState = {
  txns: [],
  loading: true,
  loadingInitial: true,
  filtersOpen: false,
  showLoadMoreButton: true,
  errorFetching: false,
}

const MiniBeaconMap = dynamic(
  () => import('../components/Beacons/MiniBeaconMap'),
  {
    ssr: false,
    loading: () => <div className="h-80 md:h-96 bg-navy-500" />,
  },
)

const exportableEntities = ['account', 'hotspot']

const RetryButton = ({ onClick }) => (
  <button
    className={classNames(
      'px-3',
      'py-1',
      'mb-10',
      'bg-gray-100',
      'cursor-pointer',
      'rounded-sm',
      'text-navy-800',
      'font-sans',
      'border-gray-400',
      'border',
      'outline-none',
      'border-solid',
      'hover:bg-gray-300',
      'focus:border-navy-400',
    )}
    onClick={onClick}
  >
    Retry
  </button>
)

class ActivityList extends Component {
  state = initialState

  async componentDidMount() {
    this.client = new Client(Network.production, { retry: 0 })
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.loadData()
    }
  }

  makeList = async (filters = []) => {
    const { type, address } = this.props
    const params = filters.length === 0 ? {} : { filterTypes: filters }
    if (type === 'account') {
      return await this.client.account(address).activity.list(params)
    }
    if (type === 'hotspot') {
      return await this.client.hotspot(address).activity.list(params)
    }
    throw new Error('type prop is required')
  }

  loadData = async () => {
    if (!this.props.address) return
    await this.setState(initialState)
    this.list = await this.makeList()
    this.loadMore()
  }

  loadMore = async () => {
    try {
      this.setState({ loading: true, retry: false })
      const { txns } = this.state
      const nextTxns = await this.list.take(20)

      if (nextTxns.length < 20) {
        this.setState({ showLoadMoreButton: false })
      }

      this.setState({
        txns: [...txns, ...nextTxns],
        loading: false,
        loadingInitial: false,
      })
    } catch (e) {
      console.error(e)
      this.setState({
        errorFetching: true,
        loading: false,
        loadingInitial: false,
      })
    }
  }

  toggleFilters = () => {
    this.setState({ filtersOpen: !this.state.filtersOpen })
  }

  onFiltersChanged = async (filters) => {
    this.list = await this.makeList(filters)

    await this.setState({ txns: [], loading: true })
    this.loadMore()
  }

  onRetry = () => {
    this.setState({ errorFetching: false })
    this.loadData()
  }

  render() {
    const {
      txns,
      loading,
      loadingInitial,
      filtersOpen,
      showLoadMoreButton,
      errorFetching,
    } = this.state
    const { address, hotspots, type } = this.props

    return (
      <Content style={{ marginTop: 0 }}>
        <Card
          loading={loadingInitial}
          title="Activity"
          extra={
            <>
              {exportableEntities.includes(type) && (
                <ExportCSV
                  type={type}
                  address={address}
                  style={{ marginRight: 10 }}
                />
              )}
              <Tooltip title="Toggle Filters">
                <Button
                  shape="circle"
                  onClick={this.toggleFilters}
                  icon={<FilterOutlined />}
                />
              </Tooltip>
            </>
          }
        >
          {filtersOpen && (
            <>
              <div style={{ padding: 24 }}>
                <p style={{ marginBottom: 8 }}>
                  <Text strong>Filter by Type:</Text>
                </p>
                <p style={{ marginBottom: 20 }}>
                  <Checkbox.Group
                    options={[
                      { label: 'Mining Rewards (v1)', value: 'rewards_v1' },
                      { label: 'Mining Rewards (v2)', value: 'rewards_v2' },
                      { label: 'Payment (v1)', value: 'payment_v1' },
                      { label: 'Payment (v2)', value: 'payment_v2' },
                      { label: 'Add Hotspot', value: 'add_gateway_v1' },
                      {
                        label: 'Assert Location (v1)',
                        value: 'assert_location_v1',
                      },
                      {
                        label: 'Assert Location (v2)',
                        value: 'assert_location_v2',
                      },
                      {
                        label: 'Packets Transferred',
                        value: 'state_channel_close_v1',
                      },
                      {
                        label: 'Transfer Hotspot',
                        value: 'transfer_hotspot_v1',
                      },
                      { label: 'Token Burn', value: 'token_burn_v1' },
                    ]}
                    onChange={this.onFiltersChanged}
                  />
                </p>
              </div>
            </>
          )}
          {txns.length === 0 || errorFetching ? (
            <div className="flex flex-col items-center justify-center">
              <h2
                style={{
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.25)',
                  padding: '10px 20px',
                }}
              >
                {loading
                  ? 'Activity is loading'
                  : errorFetching
                  ? 'Error fetching activity'
                  : type === 'account'
                  ? 'Account has no activity'
                  : 'Hotspot has no activity'}
              </h2>
              {errorFetching && <RetryButton onClick={this.onRetry} />}
            </div>
          ) : (
            <>
              <Table
                dataSource={txns}
                columns={columns(address)}
                size="small"
                rowKey="hash"
                pagination={false}
                loading={loading}
                scroll={{ x: true }}
                expandable={{
                  expandedRowRender: (record) => {
                    if (
                      record.type === 'rewards_v1' ||
                      record.type === 'rewards_v2'
                    ) {
                      return (
                        <span className="ant-table-override">
                          <Table
                            dataSource={record.rewards}
                            columns={rewardColumns(hotspots, type, address)}
                            size="small"
                            rowKey={(r) => `${r.type}-${r.gateway}`}
                          />
                        </span>
                      )
                    } else {
                      const beacon = record
                      const challenger = record.challenger
                      const paths = beacon?.path || []
                      return (
                        <>
                          <Link href={`/beacons/${beacon.hash}`}>
                            <a>
                              <MiniBeaconMap beacon={beacon} />
                            </a>
                          </Link>
                          <div>
                            <div className="bg-navy-900 p-4">
                              <div className="text-gray-700">CHALLENGER</div>
                              <div className="flex w-full">
                                <Link
                                  prefetch={false}
                                  href={`/hotspots/${challenger}`}
                                >
                                  <a
                                    className={`text-white inline-block${
                                      challenger === address
                                        ? ' bg-gray-700 px-2 rounded-lg'
                                        : ''
                                    }`}
                                  >
                                    {animalHash(challenger)}
                                  </a>
                                </Link>
                              </div>
                            </div>

                            <div
                              className="bg-white pb-20 p-4 lg:overflow-y-scroll lg:rounded-b-xl"
                              style={{ overflowY: 'overlay' }}
                            >
                              {paths.map((path) => (
                                <div>
                                  <div className="border-b">
                                    <img
                                      src="/images/beaconer.svg"
                                      alt=""
                                      className="mb-2"
                                    />
                                    <BeaconRow>
                                      <BeaconLabel>BEACONER</BeaconLabel>
                                      <BeaconLabel>LOCATION</BeaconLabel>
                                    </BeaconRow>
                                    <BeaconRow>
                                      <Link
                                        prefetch={false}
                                        href={`/hotspots/${path.challengee}`}
                                      >
                                        <a
                                          className={`text-gray-700${
                                            path.challengee === address
                                              ? ' bg-gray-350 px-2 rounded-lg'
                                              : ''
                                          }`}
                                        >
                                          {animalHash(path.challengee)}
                                        </a>
                                      </Link>
                                      <span className="text-gray-700">
                                        <FlagLocation geocode={path.geocode} />
                                      </span>
                                    </BeaconRow>
                                  </div>
                                  <hr className="my-6 border-gray-350" />
                                  <div>
                                    <div className="mb-2">
                                      <img src="/images/witness.svg" />
                                    </div>
                                    <WitnessesTable
                                      path={path}
                                      highlightedAddress={address}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                    }
                  },
                  rowExpandable: (record) =>
                    record.type === 'rewards_v1' ||
                    record.type === 'rewards_v2' ||
                    record.type === 'poc_receipts_v1',
                }}
              />
              {showLoadMoreButton && <LoadMoreButton onClick={this.loadMore} />}
            </>
          )}
        </Card>
      </Content>
    )
  }
}

const rewardColumns = (hotspots, type, address) => {
  let columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (data) => <TxnTag type={data} />,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (data) => (
        <span className="ant-table-cell-override">
          <p>{data.toString(2)}</p>
        </span>
      ),
    },
  ]

  if (type === 'account') {
    columns.push({
      title: 'Hotspot',
      dataIndex: 'gateway',
      key: 'gateway',
      render: (data) => (
        <span className="ant-table-cell-override">
          {data && (
            <Link href={`/hotspots/${data}`} prefetch={false}>
              <a>{animalHash(data)}</a>
            </Link>
          )}
        </span>
      ),
    })
  }

  return columns
}

const columns = (ownerAddress) => {
  const activityDetails = (txn) => {
    switch (txn.type) {
      case 'state_channel_close_v1':
        let totalDcs = 0
        let res = txn.stateChannel.summaries.find(
          (o) => o.client === ownerAddress,
        )
        if (!res) {
          txn.stateChannel.summaries.forEach((s) => {
            totalDcs += s.num_dcs
          })
        }
        return <span>{res ? res.num_dcs : totalDcs} DC</span>
      case 'payment_v1':
        if (txn.payer === ownerAddress)
          return <span>{'-' + txn.amount.toString(2)}</span>
        return <span>{'+' + txn.amount.toString(2)}</span>
      case 'payment_v2':
        if (txn.payer === ownerAddress)
          return <span>{'-' + txn.totalAmount.toString(2)}</span>
        return (
          <span>
            {'+' +
              txn.payments
                .find((p) => p.payee === ownerAddress)
                .amount.toString(2)}
          </span>
        )
      case 'token_burn_v1':
        return <span>{txn.amount.toString(2)}</span>

      case 'rewards_v1':
        return <span>{txn.totalAmount.toString(2)}</span>
      case 'rewards_v2':
        return <span>{txn.totalAmount.toString(2)}</span>
      case 'poc_receipts_v1':
        let detailText = ''
        if (txn.challenger === ownerAddress) {
          let city, country
          if (txn.path[0]?.geocode?.longCity) {
            city = txn.path[0].geocode.longCity
            country = txn.path[0].geocode.longCountry
          }
          detailText = `${city}, ${country}`
        } else {
          txn.path.map((p) => {
            if (p.challengee === ownerAddress) {
              const witnesses = p.witnesses.length
              detailText = `${witnesses} witness${witnesses === 1 ? '' : 'es'}`
            } else {
              p.witnesses.map((w) => {
                if (w.gateway === ownerAddress) {
                  const [witnessLat, witnessLng] = h3ToGeo(w.location)
                  let distance, location
                  if (p.challengeeLon) {
                    distance = formatDistance(
                      calculateDistance(
                        [p.challengeeLon, p.challengeeLat],
                        [witnessLng, witnessLat],
                      ),
                    )
                  } else {
                    distance = ''
                  }
                  if (p?.geocode?.longCity) {
                    location = p.geocode.longCity
                  }
                  detailText = `${distance}, ${location}`
                }
              })
            }
          })
        }
        return <span>{detailText}</span>
      case 'transfer_hotspot_v1':
        if (txn.gateway === ownerAddress) {
          // it's on the hotspot page, don't show + or -
          return <span>{txn.amountToSeller.toString()}</span>
        } else if (txn.buyer === ownerAddress) {
          return <span>{'-' + txn.amountToSeller.toString()}</span>
        } else {
          // it must be on the seller's account page
          return <span>{'+' + txn.amountToSeller.toString()}</span>
        }
      default:
        return
    }
  }

  return [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (data, txn) => {
        if (txn.type !== 'poc_receipts_v1') {
          return (
            <Link href={`/txns/${txn.hash}`} prefetch={false}>
              <a className="tag-link">
                <TxnTag type={data} />
              </a>
            </Link>
          )
        } else {
          let role = ''
          if (txn.challenger === ownerAddress) {
            role = 'poc_challengers'
          } else {
            txn.path.map((p) => {
              if (p.challengee === ownerAddress) {
                role = 'poc_challengees'
              } else {
                p.witnesses.map((w) => {
                  if (w.gateway === ownerAddress) {
                    role = w.isValid
                      ? 'poc_witnesses_valid'
                      : 'poc_witnesses_invalid'
                  }
                })
              }
            })
          }
          return (
            <Link href={`/txns/${txn.hash}`} prefetch={false}>
              <a className="tag-link">
                <TxnTag type={role} />
              </a>
            </Link>
          )
        }
      },
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (txt, txn) => (
        <Link href={`/txns/${txn.hash}`} prefetch={false}>
          <a>{activityDetails(txn)}</a>
        </Link>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => <Timestamp date={time} />,
    },
    {
      title: 'Block Height',
      dataIndex: 'height',
      key: 'height',
      render: (height) => (
        <Link href={`/blocks/${height}`} prefetch={false}>
          <a>{height}</a>
        </Link>
      ),
    },
  ]
}

export default ActivityList
