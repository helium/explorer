import React, { Component } from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import TruncatedField from './TruncatedField'
// import { formatLocation } from '../Hotspots/utils'
// import ConsensusTable, {
//   makeArrayWorkWithAntTable,
//   generateColumns,
// } from '../ConsensusTable'

import dynamic from 'next/dynamic'

// const ConsensusMapbox = dynamic(() => import('./ConsensusMapbox'), {
//   ssr: false,
//   loading: () => <div style={{ minHeight: '600px' }} />,
// })

const initialState = {
  loading: true,
  consensusHotspots: [],
}

class ConsensusGroupV1 extends Component {
  constructor(props) {
    super(props)
  }

  state = initialState

  async componentDidMount() {
    this.setState({ loading: true })
    this.loadData()
  }

  loadData = async () => {
    // TODO: convert this to helium-js
    const res = await fetch(
      `https://api.helium.io/v1/hotspots/elected/${this.props.txn.height}`,
    )
    const consensusHotspots = await res.json()
    this.setState({ consensusHotspots: consensusHotspots.data })
    this.setState({ loading: false })
  }
  render() {
    const { loading, consensusHotspots } = this.state
    const { txn } = this.props

    return (
      <div>
        <div>
          {/* {!loading && (
            <div style={{ minHeight: '600px', backgroundColor: '#324b61' }}>
              <ConsensusMapbox members={consensusHotspots} />
            </div>
          )} */}
        </div>
        <Descriptions bordered layout="vertical">
          <Descriptions.Item label="Consensus Group Members">
            {/* <ConsensusTable
              loading={loading}
              columns={generateColumns('current')}
              dataSource={consensusHotspots}
            /> */}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered>
          <Descriptions.Item label="Block Height" span={3}>
            <Link href={'/blocks/' + txn.height}>
              <a>{txn.height}</a>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Delay" span={3}>
            {txn.delay}
          </Descriptions.Item>
          <Descriptions.Item label="Proof" span={3}>
            <TruncatedField value={txn.proof} />
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }
}

export default ConsensusGroupV1
