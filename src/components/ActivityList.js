import React, { Component } from 'react'
import Client from '@helium/http'
import {
  Row,
  Col,
  Table,
  Card,
  Button,
  Tooltip,
  Checkbox,
  Typography,
} from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import TxnTag from './TxnTag'
import LoadMoreButton from './LoadMoreButton'
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
    if (type === 'account') {
      return await this.client
        .account(address)
        .activity.list({ filterTypes: filters })
    }
    if (type === 'hotspot') {
      return await this.client
        .hotspot(address)
        .activity.list({ filterTypes: filters })
    }
    throw new Error('type prop is required')
  }

  loadData = async () => {
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
    return (
      <Row gutter={8} style={{ marginTop: 20 }}>
        <Col xs={16} offset={4}>
          <Card
            loading={loadingInitial}
            title="Activity"
            extra={
              <Tooltip title="Toggle Filters">
                <Button
                  shape="circle"
                  onClick={this.toggleFilters}
                  icon={<FilterOutlined />}
                />
              </Tooltip>
            }
          >
            {filtersOpen && (
              <>
                <Row style={{ marginBottom: 8 }}>
                  <Text strong>Filter by Type:</Text>
                </Row>
                <Row style={{ marginBottom: 20 }}>
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
                </Row>
              </>
            )}
            <Table
              dataSource={txns}
              columns={columns}
              size="small"
              rowKey="hash"
              pagination={false}
              loading={loading}
            />
            <LoadMoreButton onClick={this.loadMore} />
          </Card>
        </Col>
      </Row>
    )
  }
}

const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (data) => <TxnTag type={data}></TxnTag>,
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
]

const activityAmount = (txn) => {
  switch (txn.type) {
    case 'payment_v1':
      return <span>{txn.amount.toString()}</span>
    case 'payment_v2':
      return <span>{txn.totalAmount.toString()}</span>
    case 'rewards_v1':
      let rewardsTotal = 0
      txn.rewards.map((r) => (rewardsTotal += r.amount))
      return <span>{rewardsTotal / 100000000} HNT</span>
    default:
      return <span>{txn.amount}</span>
  }
}

export default ActivityList
