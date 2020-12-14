import React, { Component } from 'react'
import { Descriptions } from 'antd'
import Link from 'next/link'
import animalHash from 'angry-purple-tiger'
import TruncatedField from './TruncatedField'
import { formatLocation } from '../Hotspots/utils'

import dynamic from 'next/dynamic'

const ConsensusMapbox = dynamic(() => import('../ConsensusMapbox'), {
  ssr: false,
  loading: () => <span style={{ height: '600px' }} />,
})

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
        <span>
          {!loading ? (
            <span style={{ height: '600px' }}>
              <ConsensusMapbox members={consensusHotspots} />
            </span>
          ) : (
            <div
              style={{
                height: '600px',
                minHeight: '600px',
                paddingLeft: '18px',
                paddingTop: '18px',
              }}
            >
              Loading...
            </div>
          )}
        </span>
        <Descriptions bordered layout="vertical">
          <Descriptions.Item label="Consensus Group Members">
            <ol
              style={{ listStyle: 'none', paddingLeft: 0, paddingTop: '18px' }}
            >
              {consensusHotspots.map((m, index, { length }) => {
                return (
                  <li
                    style={{
                      paddingBottom: '18px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: '#ff6666',
                          color: 'white',
                          minHeight: '36px',
                          height: '36px',
                          minWidth: '36px',
                          width: '36px',
                          borderRadius: '36px',
                          textAlign: 'center',
                          boxShadow: '0 0 5px #cccccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          marginBottom: '0px',
                        }}
                      >
                        {index + 1}
                      </span>
                      <Link href={`/hotspots/${m.address}`}>
                        <a style={{ paddingLeft: '10px', fontSize: '18px' }}>
                          {animalHash(m.address)}
                        </a>
                      </Link>
                    </div>
                    <p
                      style={{
                        color: '#555',
                        paddingLeft: 'calc(36px + 10px)',
                      }}
                    >
                      {formatLocation(m.geocode)}
                    </p>
                  </li>
                )
              })}
            </ol>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered>
          <Descriptions.Item label="Block Height" span={3}>
            <Link href={'/blocks/' + txn.height}>
              <a>{txn.height}</a>
            </Link>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions bordered>
          <Descriptions.Item label="Proof">
            <TruncatedField key={'proof'} value={txn.proof} />
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }
}

export default ConsensusGroupV1
