import React, { Component } from 'react'
import Client from '@helium/http'
import { Table, Card, Typography } from 'antd'
import Timestamp from 'react-timestamp'
import LoadMoreButton from '../LoadMoreButton'
import { Content } from '../AppLayout'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import FlagLocation from '../Common/FlagLocation'

const { Text } = Typography

const initialState = {
  beacons: [],
  loading: true,
  loadingInitial: true,
  showLoadMoreButton: true,
}

class BeaconsList extends Component {
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

  makeList = async () => {
    const { type, address } = this.props
    if (type === 'account') {
      return await this.client.account(address).challenges.list()
    }
    if (type === 'hotspot') {
      return await this.client.hotspot(address).challenges.list()
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
    const { beacons } = this.state
    const nextBeacons = await this.list.take(20)

    if (nextBeacons.length < 20) {
      this.setState({ showLoadMoreButton: false })
    }

    this.setState({
      beacons: [...beacons, ...nextBeacons],
      loading: false,
      loadingInitial: false,
    })
  }

  render() {
    const { beacons, loading, loadingInitial, showLoadMoreButton } = this.state
    const { address, type } = this.props

    return (
      <Content style={{ marginTop: 0, marginBottom: 20 }}>
        <Card loading={loadingInitial} title="Beacons">
          {beacons.length == 0 ? (
            <h2
              style={{
                textAlign: 'center',
                marginTop: '0.5rem',
                fontSize: '14px',
                color: 'rgba(0, 0, 0, 0.25)',
                padding: '20px',
              }}
            >
              {type === 'account' ? 'Account' : 'Hotspot'} has no beacons
            </h2>
          ) : (
            <Table
              dataSource={beacons}
              columns={columns()}
              size="small"
              rowKey="hash"
              pagination={false}
              loading={loading}
              scroll={{ x: true }}
            />
          )}
          {showLoadMoreButton && <LoadMoreButton onClick={this.loadMore} />}
        </Card>
      </Content>
    )
  }
}

const columns = () => {
  return [
    {
      title: 'Beaconing Hotspot',
      dataIndex: 'path',
      key: 'hotspot',
      render: (path) => (
        <Link href={`/hotspots/${path[0].challengee}`} prefetch={false}>
          <a>{animalHash(path[0].challengee)}</a>
        </Link>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'path',
      key: 'location',
      render: (path, beacon) => (
        <Link href={`/beacons/${beacon.hash}`} prefetch={false}>
          <a>
            <FlagLocation geocode={path[0].geocode} />
          </a>
        </Link>
      ),
    },
    {
      title: 'Witnesses',
      dataIndex: 'path',
      key: 'witnesses',
      render: (path) => <span>{path[0].witnesses.length}</span>,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => <Timestamp date={time} />,
    },
  ]
}

export default BeaconsList
