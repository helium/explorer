import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import BlocksChart from '../components/BlocksChart'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography, Tag, Table, Card } from 'antd'
import Chart from '../images/chart.svg'
import classNames from 'classnames'



const { Title, Text } = Typography



class Index extends React.Component {
  render() {
    return (
      <AppLayout>

 <Content style={{ marginTop: 0, background: '#27284B', padding: '60px 0 20px' }}>
        <div style={{margin: '0 auto', maxWidth: 850}}>
          
          <Title style={{margin: '0px 0 40px', maxWidth: 550, letterSpacing: '-2px', fontSize: 38, lineHeight: 1, color: 'white'}}>Helium <span style={{fontWeight: 300}}>Explorer</span></Title>
          <div style={{background:'#3F416D', borderRadius: 10, padding: '16px 24px', marginBottom: 100}}>
            <Row>
            <Col lg={12}>
              <h3 style={{marginBottom: 20, color: '#1890ff', fontSize: 14}}>Blockchain Stats</h3>

              <p className="stat"><span>Block Height:</span>NA</p>
              <p className="stat"><span>TPS(24hr):</span>NA</p>
              <p className="stat"><span>Pending Txs:</span>NA</p>
              <p className="stat"><span>Avg Block Time (24hr):</span>NA</p>
            </Col>
            <Col lg={12}>
              <h3 style={{marginBottom: 20, color: '#1890ff', fontSize: 14}}>Market Stats</h3>
               <p className="stat"><span>Market Price</span>$NA</p>
              <p className="stat"><span>Volume (24hr):</span>NA</p>
              <p className="stat"><span>Circulating Supply:</span>NA</p>
              <p className="stat"><span>Market Cap:</span>$NA</p>
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
