import React, { Component } from 'react'
import { Row, Col, Typography, Card, Descriptions } from 'antd'
import Client from '@helium/http'
import round from 'lodash/round'
import get from 'lodash/get'
import AppLayout, { Content } from '../components/AppLayout'
import ActivityList from '../components/ActivityList'
import Map from '../components/Map'
import Fade from 'react-reveal/Fade'

const { Title, Text } = Typography

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
              <Content style={{ marginTop: 0, background: '#27284B', padding: '0px 0 30px' }}>
              <div style={{margin: '0 auto', maxWidth: 850}}>
               <Map lat={hotspot.lat} lng={hotspot.lng} />

              <Row style={{paddingTop: 30}}>
                <Col lg={12}>
              <Fade delay={1000}>
              <h3 style={{color: '#27284B', background: '#BE73FF', padding: '3px 10px', borderRadius: 6, fontSize: 18, fontWeight: 600, display: 'inline-block', letterSpacing: -0.5}}>{round(hotspot.score, 2)}</h3>
              </Fade>
              <Title style={{color: 'white', fontSize: 52, marginTop: 0, lineHeight: 0.7, letterSpacing: '-2px'}}>
                  {hotspot.name}
                </Title>
                <p style={{color: 'white'}}>Owner: <a style={{ whiteSpace: 'nowrap',                  
    overflow: 'hidden',
    textOverflow: 'ellipsis' ,
    width: 200,
    display: 'inline-block',
        direction: 'rtl',
    textAlign: 'left'}} href={'/accounts/' + hotspot.owner}>{hotspot.owner}</a></p>
              </Col>
                            
              </Row>
              </div>


</Content>

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
                <Map lat={hotspot.lat} lng={hotspot.lng} />
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
