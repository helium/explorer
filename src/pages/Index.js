import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import BlocksChart from '../components/BlocksChart'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography, Tag, Table, Card } from 'antd'
const { Title, Text } = Typography


class Index extends React.Component {
  render() {
    return (
      <AppLayout>

 <Content style={{ marginTop: 0, background: '#27284B', padding: '60px 0 0' }}>
        <div style={{margin: '0 auto', maxWidth: 850}}>
          
          <Title style={{margin: '0px 0 200px', maxWidth: 550, letterSpacing: '-2px', fontSize: 38, lineHeight: 1, color: 'white'}}>Helium <br/><span style={{fontWeight: 300}}>Blockchain Explorer</span></Title>

          <div style={{position: 'relative', width: '100%'}}>
           <BlocksChart />
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
