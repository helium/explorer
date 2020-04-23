import React, { Component } from 'react'
import { Row, Col, Typography, Card, Descriptions } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import get from 'lodash/get'
import AppLayout, { Content } from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import Map from '../components/Map'
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
        <Content style={{ marginTop: 50 }}>
          <Card loading={loading} title={hotspot.name}>
            <Row>
              <Col xs={{ order: 1, span: 24 }} md={{ order: 0, span: 16 }}>
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
              <Col xs={{ order: 0, span: 24, offset: 0 }} md={{ order: 1, span: 7, offset: 1}}>
                <Map coords={[{lat: hotspot.lat, lng: hotspot.lng}]} />
              </Col>
            </Row>
          </Card>
        </Content>

        <ActivityList type="hotspot" address={hotspot.address} />
      </AppLayout>
    )
  }
}

export default HotspotView
