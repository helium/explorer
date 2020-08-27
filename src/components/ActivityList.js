import React, { Component } from 'react'
import Client from '@helium/http'
import { Table, Card, Button, Tooltip, Checkbox, Typography } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import Timestamp from 'react-timestamp'
import TxnTag from './TxnTag'
import LoadMoreButton from './LoadMoreButton'
import { Content } from './AppLayout'
import ExportCSV from './ExportCSV'
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
    const { address } = this.props
    return (
      <Content style={{ marginTop: 0 }}>
        <Card
          loading={loadingInitial}
          title="Activity"
          extra={
            <>
              <ExportCSV address={address} style={{ marginRight: 10 }} />
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
          />
          <LoadMoreButton onClick={this.loadMore} />
        </Card>
      </Content>
    )
  }
}

const columns = (ownerAddress) => {
  const activityAmount = (txn) => {
    switch (txn.type) {
      case 'state_channel_close_v1':
        let totalDcs = 0
        let res = txn.stateChannel.summaries.find(
          (o) => o.client === ownerAddress,
        )
        if (!res) {
          txn.stateChannel.summaries.map((s) => {
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
      default:
        return <span>{txn.amount}</span>
    }
  }

  return [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (data) => <TxnTag type={data}></TxnTag>,
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (data) => <a href={`/txns/${data}`}>{data.substring(1, 6)}...</a>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (txt, txn) => (
        <a href={`/txns/${txn.hash}`}>{activityAmount(txn)}</a>
      ),
    },
    {
      title: 'Block Height',
      dataIndex: 'height',
      key: 'height',
      render: (height) => <a href={`/blocks/${height}`}>{height}</a>,
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
