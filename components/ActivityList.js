import React, { Component } from 'react'
import Client from '@helium/http'
import { Table, Card, Button, Tooltip, Checkbox, Typography } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import Timestamp from 'react-timestamp'
import { TxnTag } from './Txns'
import LoadMoreButton from './LoadMoreButton'
import { Content } from './AppLayout'
import ExportCSV from './ExportCSV'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'

const { Text } = Typography

const initialState = {
  txns: [],
  loading: true,
  loadingInitial: true,
  filtersOpen: false,
}

class ActivityList extends Component {
  state = initialState

  async componentDidMount() {
    this.client = new Client()
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
    this.setState({ loading: true })
    const { txns } = this.state
    const nextTxns = await this.list.take(20)
    this.setState({
      txns: [...txns, ...nextTxns],
      loading: false,
      loadingInitial: false,
    })
  }

  toggleFilters = () => {
    this.setState({ filtersOpen: !this.state.filtersOpen })
  }

  onFiltersChanged = async (filters) => {
    this.list = await this.makeList(filters)

    await this.setState({ txns: [] })
    this.loadMore()
  }

  render() {
    const { txns, loading, loadingInitial, filtersOpen } = this.state
    const { address, hotspots, type } = this.props

    return (
      <Content style={{ marginTop: 0 }}>
        <Card
          loading={loadingInitial}
          title="Activity"
          extra={
            <>
              {type === 'account' && (
                <ExportCSV address={address} style={{ marginRight: 10 }} />
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
                      { label: 'Mining Rewards', value: 'rewards_v1' },
                      { label: 'Payment (v1)', value: 'payment_v1' },
                      { label: 'Payment (v2)', value: 'payment_v2' },
                      { label: 'Add Hotspot', value: 'add_gateway_v1' },
                      { label: 'Assert Location', value: 'assert_location_v1' },
                      {
                        label: 'Packets Transferred',
                        value: 'state_channel_close_v1',
                      },
                      {
                        label: 'Transfer Hotspot',
                        value: 'transfer_hotspot_v1',
                      },
                    ]}
                    onChange={this.onFiltersChanged}
                  />
                </p>
              </div>
            </>
          )}
          <Table
            dataSource={txns}
            columns={columns(address)}
            size="small"
            rowKey="hash"
            pagination={false}
            loading={loading}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (record) => (
                <span className="ant-table-override">
                  <Table
                    dataSource={record.rewards}
                    columns={rewardColumns(hotspots, type)}
                    size="small"
                    rowKey={(r) => `${r.type}-${r.gateway}`}
                  />
                </span>
              ),
              rowExpandable: (record) => record.type === 'rewards_v1',
            }}
          />
          <LoadMoreButton onClick={this.loadMore} />
        </Card>
      </Content>
    )
  }
}

const rewardColumns = (hotspots, type) => {
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
            <Link href={`/hotspots/${data}`}>
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
      case 'rewards_v1':
        return <span>{txn.totalAmount.toString(2)}</span>
      case 'poc_receipts_v1':
        let detailText = ''
        if (txn.challenger === ownerAddress) {
          detailText = 'Challenger'
          return
        } else {
          txn.path.map((p) => {
            if (p.challengee === ownerAddress) {
              detailText = 'Challengee'
              return
            } else {
              p.witnesses.map((w) => {
                if (w.gateway === ownerAddress) {
                  detailText = 'Witness'
                  return
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
        return <span>{txn.amount}</span>
    }
  }

  return [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (data, txn) => <TxnTag type={data}></TxnTag>,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (txt, txn) => (
        <Link href={`/txns/${txn.hash}`}>
          <a>{activityDetails(txn)}</a>
        </Link>
      ),
    },
    {
      title: 'Block Height',
      dataIndex: 'height',
      key: 'height',
      render: (height) => (
        <Link href={`/blocks/${height}`}>
          <a>{height}</a>
        </Link>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => <Timestamp date={time} />,
    },
  ]
}

export default ActivityList
