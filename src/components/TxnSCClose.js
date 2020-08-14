import React, { Component } from 'react'
import { Typography, Tag, Table, Card, List, Descriptions } from 'antd'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import Client from '@helium/http'
import animalHash from 'angry-purple-tiger'
import TxnTag from '../components/TxnTag'

const Mapbox = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA',
})

const styles = {
  selectedMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#1B8DFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  transmittingMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #fff',
  },
  gatewayMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#A984FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #8B62EA',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
  },
}

class TxnSCClose extends Component {
  state = {
    totalPackets: 0,
    totalHotspots: 0,
    totalDcs: 0,
    columns: [
      {
        title: 'Hotspot',
        dataIndex: 'client',
        key: 'client',
        render: (data) => (
          <span>
            <a href={'/hotspots/' + data}>{animalHash(data)}</a>
          </span>
        ),
      },
      {
        title: 'Packets Sent',
        dataIndex: 'num_packets',
        key: 'num_packets',
      },
      {
        title: 'Data Credits Used',
        dataIndex: 'num_dcs',
        key: 'num_dcs',
      },
    ],
    data: [],
    hotspots: [],
  }

  componentDidMount() {
    this.tallyValues()
    this.client = new Client()
    this.loadData()
  }

  async loadData() {
    const { hotspots } = this.state
    const list = await this.client.hotspots.list()
    const allSpots = await list.take(10000)
    this.setState({ hotspots: allSpots })
  }

  tallyValues() {
    const { txn } = this.props
    let { totalPackets, totalHotspots, totalDcs, data } = this.state
    txn.stateChannel.summaries.map((s) => {
      totalPackets += s.num_packets
      totalDcs += s.num_dcs
      data.push({
        client: s.client,
        num_packets: s.num_packets,
        num_dcs: s.num_dcs,
      })
    })
    data.sort((b, a) =>
      a.num_dcs > b.num_dcs ? 1 : b.num_dcs > a.num_dcs ? -1 : 0,
    )
    totalHotspots = txn.stateChannel.summaries.length
    this.setState({ totalPackets, totalDcs, totalHotspots, data: [...data] })
  }

  render() {
    const { txn } = this.props
    const {
      hotspots,
      totalPackets,
      totalDcs,
      totalHotspots,
      columns,
      data,
    } = this.state
    console.log(data)

    return (
      <div>
        <Mapbox
          style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
          container="map"
          center={[-95.712891, 37.09024]}
          containerStyle={{
            height: '600px',
            width: '100%',
          }}
          zoom={[3]}
          movingMethod="jumpTo"
        >
          {txn.stateChannel.summaries.map((s) => {
            const hotspot = hotspots.find((e) => e.address === s.client)
            if (hotspot) {
              return (
                <Marker
                  key={hotspot.address}
                  style={styles.gatewayMarker}
                  anchor="center"
                  coordinates={[hotspot.lng, hotspot.lat]}
                />
              )
            }
          })}
        </Mapbox>

        <Descriptions bordered>
          <Descriptions.Item label="Block Height" span={3}>
            <a href={'/blocks/' + txn.height}>{txn.height}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Total Packets" span={3}>
            {totalPackets}
          </Descriptions.Item>
          <Descriptions.Item label="Data Credits Spent" span={3}>
            {totalDcs}
          </Descriptions.Item>
          <Descriptions.Item label="Number of Hotspots" span={3}>
            {totalHotspots}
          </Descriptions.Item>
          <Descriptions.Item label="State Channel Closer" span={3}>
            <a href={'/accounts/' + txn.closer}>{txn.closer}</a>
          </Descriptions.Item>
          <Descriptions.Item label="State Channel Owner" span={3}>
            <a href={'/accounts/' + txn.stateChannel.owner}>
              {txn.stateChannel.owner}
            </a>
          </Descriptions.Item>
        </Descriptions>

        <Table
          dataSource={data}
          columns={columns}
          style={{ marginTop: '10px' }}
          pagination={false}
        />

        <Descriptions bordered style={{ marginTop: '20px' }}>
          {Object.entries(txn).map(([key, value]) => {
            return (
              <Descriptions.Item label={key} span={3}>
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      </div>
    )
  }
}

export default TxnSCClose
