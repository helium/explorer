import React, { Component } from 'react'
import { Layout, Row, Col, Typography, Icon, Tag, Table, Card } from 'antd';
import SearchBar from '../components/SearchBar'
import TxnTag from '../components/TxnTag'
const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

class HotspotView extends Component {
  state = {
    hotspot: {},
    block: {},
    activity: [],
    loading: true,
    activityLoading: true,
  }

  componentDidMount() {
    this.loadHotspot()
  }

  async loadHotspot() {
    let { hotspot, block, activity, activityLoading, loading } = this.state
    const h = await (await fetch("https://api.helium.io/v1/hotspots/" + this.props.match.params.address)).json()
    const b = await (await fetch("https://api.helium.io/v1/blocks/" + h.data.block)).json()
    fetch("https://api.helium.io/v1/hotspots/" + this.props.match.params.address + "/activity")
    .then(res => res.json())
    .then(act => {
      activity = act.data
      activityLoading = false
      this.setState({ activity, activityLoading })
    })    
    hotspot = h.data
    block = b.data
    loading = false
    this.setState({ hotspot, block, loading })
  }
  
  render() {
    const { hotspot, block, activity, activityLoading, loading } = this.state;
    const activityColumns = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: data => <TxnTag type={data}></TxnTag>
      },
      {
        title: 'Hash',
        dataIndex: 'hash',
        key: 'hash',
        render: data => <a href={'/txns/' + data}>{data}</a>
      },
      {
        title: 'Block Height',
        dataIndex: 'height',
        key: 'height',
      }
    ]

    return (
        <div>
          <Layout>
            <Header>
              <a href ='/'><div className="logo" /></a>
            </Header>

            <Content style={{ padding: '50px' }}>
              <div>
                <Row gutter={8}>
                    <Col xs={12} offset={6}>
                        <SearchBar></SearchBar>
                    </Col>
                </Row>
              </div>

              <div style={{ marginTop: '50px'}}>              
                <Row gutter={8}>
                  <Col xs={16} offset={4}>
                    <Card loading={loading} title={hotspot.name}>                      
                      <div>
                        <p><img src={"https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-m(" + hotspot.lng + "," + hotspot.lat + ")/" + hotspot.lng + "," + hotspot.lat + ",11/400x300?access_token=pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA"}/></p>
                        <p>Address: {hotspot.address}</p>
                        <p><Text>Score: {hotspot.score}</Text></p>
                        <p><Text>Added in block <a href={'/blocks/' + block.hash}>{hotspot.block}</a></Text></p>
                        <p><Text>Owner: <a href={'/accounts/' + hotspot.owner}>{hotspot.owner}</a></Text></p>

                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>

              <div style={{ marginTop: '20px'}}>              
                <Row gutter={8}>
                  <Col xs={16} offset={4}>
                    <Card title={'Activity'}>
                    <Table dataSource={activity} 
                        columns={activityColumns}
                        size="small" 
                        rowKey="hash"
                        loading={activityLoading} 
                        pagination={{ pageSize: 50 }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </Content>
          </Layout>
        </div>                   
                  
    )    
  }
}

export default HotspotView
