import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import BlocksChart from '../components/BlocksChart'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography, Tag, Table, Card } from 'antd'
import Chart from '../images/chart.svg'



const { Title, Text } = Typography



class Index extends React.Component {
  render() {
    return (
      <AppLayout>

 <Content style={{ marginTop: 0, background: '#27284B', padding: '60px 0 40px' }}>
        <div style={{margin: '0 auto', maxWidth: 850}}>
          
          <Title style={{margin: '0px 0 40px', maxWidth: 550, letterSpacing: '-2px', fontSize: 38, lineHeight: 1, color: 'white'}}>Helium <span style={{fontWeight: 300}}>Explorer</span></Title>
          <div style={{background:'#3F416D', borderRadius: 10, padding: '14px 24px', marginBottom: 50}}>
            <Row>
            <Col lg={12}>
              <h3>Blockchain Stats</h3>
            </Col>
            <Col lg={12}>
              <h3>Market Stats</h3>
            </Col>

            </Row>

          </div>
          <div style={{position: 'relative', width: '100%'}}>
           <img src={Chart} />
           </div>
            </div>
        </Content>





                 <Content style={{ marginTop: '50px', margin: '0 auto', maxWidth: 850, paddingBottom: 100 }}>
                 <div style={{background: 'white', padding: 15}}>
                  <h2 style={{marginTop: 20}}>Latest Blocks</h2>
                  </div>
            <BlocksList />
          </Content>
      </AppLayout>
    )
  }
}

export default Index
