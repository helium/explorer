import React, { Component } from 'react'
import { Row, Col, Typography, Card, Descriptions } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import get from 'lodash/get'
import AppLayout from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
const { Text } = Typography

const initialState = {
  hotspot: {},
  activity: [],
  loading: true,
  activityLoading: true,
}

class HotspotView extends Component {
  state = initialState

  componentDidMount() {
    this.client = new Client()
    this.loadData()
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

  render() {
    const { hotspot, loading } = this.state
    console.log(hotspot)

    return (
      <AppLayout>
        <Row gutter={8} style={{ marginTop: 50 }}>
          <Col xs={16} offset={4}>
            <Card loading={loading} title={hotspot.name}>
              <Row>
                <Col span={16}>
                  <Descriptions bordered>
                    <Descriptions.Item label="Address" span={3}>
                      <Text code copyable>
                        {hotspot.address}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Owner" span={3}>
                      <a href={'/accounts/' + hotspot.owner}>{hotspot.owner}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Score" span={3}>
                      {round(hotspot.score, 2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location" span={3}>
                      {get(hotspot, 'geocode.longCity')},{' '}
                      {get(hotspot, 'geocode.shortState')}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span="7" offset="1">
                  <img
                    style={{ width: '100%' }}
                    src={
                      'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-m(' +
                      hotspot.lng +
                      ',' +
                      hotspot.lat +
                      ')/' +
                      hotspot.lng +
                      ',' +
                      hotspot.lat +
                      ',11/400x300?access_token=pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA'
                    }
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <ActivityList type="hotspot" address={hotspot.address} />
      </AppLayout>
    )
  }
}

export default HotspotView
