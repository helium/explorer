import React, { Component } from 'react'
import { Row, Typography, Checkbox, Tooltip, Card, Table } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import get from 'lodash/get'
import AppLayout, { Content } from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import ReactMapboxGl, { Layer, Marker, Feature } from 'react-mapbox-gl'
import Fade from 'react-reveal/Fade'
import HotspotImg from '../images/hotspot.svg'

const { Title, Text } = Typography

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
  witnessMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#F1C40F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #B7950B',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5)',
    cursor: 'pointer',
    opacity: 0.3,
  },
}

const initialState = {
  hotspot: {},
  witnesses: [],
  activity: [],
  loading: true,
  activityLoading: true,
  showWitnesses: false,
}

class HotspotView extends Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
    this.loadData()
    this.loadWitnesses()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.loadData()
    }
  }

  async loadData() {
    const { address } = this.props.match.params
    await this.setState(initialState)
    const hotspot = await this.client.hotspots.get(address)
    this.setState({ hotspot, loading: false })
  }

  async loadWitnesses() {
    const { address } = this.props.match.params
    fetch('https://api.helium.io/v1/hotspots/' + address + '/witnesses')
      .then((res) => res.json())
      .then((witnessData) => {
        this.setState({
          witnesses: witnessData.data,
        })
      })
  }

  toggleWitnesses = (e) => {
    this.setState({
      showWitnesses: e.target.checked,
    })
  }

  render() {
    const { hotspot, witnesses, showWitnesses } = this.state

    console.log(witnesses)

    const witnessColumns = [
      {
        title: 'Hotspot',
        dataIndex: 'name',
        key: 'name',
        render: (data, row) => (
          <a
            style={{ fontFamily: 'soleil, sans-serif' }}
            href={'/hotspots/' + row.address}
          >
            {data}
          </a>
        ),
      },
      {
        title: 'Location',
        dataIndex: 'geocode',
        key: 'location',
        render: (data) => (
          <span>
            {data.long_city}, {data.short_state}
          </span>
        ),
      },
      {
        title: 'RSSI',
        dataIndex: 'witness_info',
        key: 'rssi',
        render: (data) => (
          <span>
            {Object.keys(data.histogram).reduce((a, b) =>
              data.histogram[a] > data.histogram[b] ? a : b,
            )}{' '}
            dBm
          </span>
        ),
      },
    ]

    return (
      <AppLayout>
        <Content
          style={{ marginTop: 0, background: '#27284B', padding: '0px 0 0px' }}
        >
          <div style={{ margin: '0 auto', maxWidth: 850 }}>
            <Mapbox
              style="mapbox://styles/petermain/cjyzlw0av4grj1ck97d8r0yrk"
              container="map"
              center={[
                hotspot.lng ? hotspot.lng : 0,
                hotspot.lat ? hotspot.lat : 0,
              ]}
              containerStyle={{
                height: '400px',
                width: '100%',
              }}
              zoom={[11]}
              movingMethod="jumpTo"
            >
              <Marker
                key={hotspot.address}
                style={styles.gatewayMarker}
                anchor="center"
                symbol="yolo"
                coordinates={[
                  hotspot.lng ? hotspot.lng : 0,
                  hotspot.lat ? hotspot.lat : 0,
                ]}
              />

              {showWitnesses &&
                witnesses.map((w) => {
                  return (
                    <span>
                      <Marker
                        key={w.address}
                        style={styles.witnessMarker}
                        anchor="center"
                        coordinates={[w.lng, w.lat]}
                      ></Marker>
                      <Layer
                        key={'line-' + w.address}
                        type="line"
                        layout={{
                          'line-cap': 'round',
                          'line-join': 'round',
                        }}
                        paint={{
                          'line-color': '#F1C40F',
                          'line-width': 2,
                          'line-opacity': 0.3,
                        }}
                      >
                        <Feature
                          coordinates={[
                            [w.lng, w.lat],
                            [hotspot.lng, hotspot.lat],
                          ]}
                        />
                      </Layer>
                    </span>
                  )
                })}
            </Mapbox>
            <div style={{ textAlign: 'right', paddingTop: 6, color: 'white' }}>
              <Checkbox
                onChange={this.toggleWitnesses}
                style={{ color: 'white' }}
              >
                Show witnesses
              </Checkbox>
              <p style={{ marginBottom: '-20px' }}>
                {get(hotspot, 'geocode.longCity')},{' '}
                {get(hotspot, 'geocode.shortState')}
              </p>
            </div>
            <Row style={{ paddingTop: 30 }}>
              <div
                className="flexwrapper"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  marginBottom: 50,
                }}
              >
                <div style={{ width: '100%' }}>
                  <Fade delay={1000}>
                    <Tooltip
                      placement="bottom"
                      title="The network score of this hotspot. From 0 to 1, with 1 being optimum performance."
                    >
                      <h3
                        style={{
                          color: '#27284B',
                          background: '#BE73FF',
                          padding: '1px 6px',
                          borderRadius: 6,
                          fontSize: 16,
                          fontWeight: 600,
                          display: 'inline-block',
                          letterSpacing: -0.5,
                        }}
                      >
                        {round(hotspot.score, 2)}
                      </h3>
                    </Tooltip>
                  </Fade>
                  <Title
                    style={{
                      color: 'white',
                      fontSize: 52,
                      marginTop: 0,
                      lineHeight: 0.7,
                      letterSpacing: '-2px',
                      marginBottom: 17,
                    }}
                  >
                    {hotspot.name}
                  </Title>
                  <Tooltip placement="bottom" title="Hotspot Network Address">
                    <Text
                      copyable
                      style={{ fontFamily: 'monospace', color: '#8283B2' }}
                    >
                      <img
                        src={HotspotImg}
                        style={{
                          height: 15,
                          marginRight: 5,
                          position: 'relative',
                          top: '-2px',
                        }}
                      />
                      {hotspot.address}
                    </Text>
                  </Tooltip>
                </div>
              </div>
            </Row>
          </div>

          <div className="bottombar">
            <Content style={{ maxWidth: 850, margin: '0 auto' }}>
              <p style={{ color: 'white', margin: 0 }}>
                Owned by:{' '}
                <a href={'/accounts/' + hotspot.owner}>{hotspot.owner}</a>
              </p>
            </Content>
          </div>
        </Content>

        <Content
          style={{
            margin: '0 auto',
            maxWidth: 850,
            paddingBottom: 20,
            marginTop: 0,
          }}
        >
          <Card title={'Witnesses'}>
            <Table
              dataSource={witnesses}
              columns={witnessColumns}
              size="small"
              rowKey="name"
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              scroll={{ x: true }}
            />
          </Card>
        </Content>

        <Content
          style={{
            marginTop: '20px',
            margin: '0 auto',
            maxWidth: 850,
            paddingBottom: 100,
          }}
        >
          <ActivityList type="hotspot" address={hotspot.address} />
        </Content>
      </AppLayout>
    )
  }
}

export default HotspotView
