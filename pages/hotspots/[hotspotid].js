import React, { Component } from 'react'
import { Row, Typography, Checkbox, Tooltip, Card, Table } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import get from 'lodash/get'
import AppLayout, { Content } from '../../components/AppLayout'
import ActivityList from '../../components/ActivityList'
import Fade from 'react-reveal/Fade'
import HotspotImg from '../../public/images/hotspot.svg'

import { withRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const HotspotMapbox = dynamic(() => import('../../components/HotspotMapbox'), {
  ssr: false,
  loading: () => <div />,
})

const { Title, Text } = Typography

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
    const { hotspotid } = this.props.router.query
    if (hotspotid !== undefined) {
      this.loadData(hotspotid)
      this.loadWitnesses(hotspotid)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.router.query !== this.props.router.query) {
      const { hotspotid } = this.props.router.query
      if (hotspotid !== undefined) {
        this.loadData(hotspotid)
      }
    }
  }

  async loadData(hotspotid) {
    // const { address } = this.props.match.params
    await this.setState(initialState)
    const hotspot = await this.client.hotspots.get(hotspotid)
    this.setState({ hotspot, loading: false })
  }

  async loadWitnesses(hotspotid) {
    // const { address } = this.props.match.params
    fetch('https://api.helium.io/v1/hotspots/' + hotspotid + '/witnesses')
      .then((res) => res.json())
      .then((witnessData) => {
        const witnessList = witnessData.data.filter(
          (w) => !(w.address === hotspotid),
        )
        this.setState({
          witnesses: witnessList,
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

    const witnessColumns = [
      {
        title: 'Hotspot',
        dataIndex: 'name',
        key: 'name',
        render: (data, row) => (
          <Link href={'/hotspots/' + row.address}>
            <a style={{ fontFamily: 'soleil, sans-serif' }}>{data}</a>
          </Link>
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
          <div
            style={{ margin: '0 auto', maxWidth: 850 + 40 }}
            className="content-container-hotspot-view"
          >
            <HotspotMapbox
              hotspot={hotspot}
              witnesses={witnesses}
              showWitnesses={showWitnesses}
            />
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
                  // marginBottom: 50,
                  paddingRight: 20,
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
                  <span className="hotspot-name">
                    <Title
                      style={{
                        color: 'white',
                        fontSize: 52,
                        marginTop: 0,
                        letterSpacing: '-2px',
                        marginBottom: 17,
                      }}
                    >
                      {hotspot.name}
                    </Title>
                  </span>
                  <Tooltip placement="bottom" title="Hotspot Network Address">
                    <img
                      src={HotspotImg}
                      style={{
                        height: 15,
                        marginRight: 5,
                        position: 'relative',
                        top: '-2px',
                      }}
                      alt="Hotspot Network Address"
                    />
                    <Text
                      copyable
                      style={{
                        fontFamily: 'monospace',
                        color: '#8283B2',
                        wordBreak: 'break-all',
                      }}
                    >
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
                Owned by: <br className="line-break-only-at-small" />
                <Link href={'/accounts/' + hotspot.owner}>
                  <a style={{ wordBreak: 'break-all' }}>{hotspot.owner}</a>
                </Link>
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

export default withRouter(HotspotView)
