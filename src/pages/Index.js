import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import AppLayout, { Content } from '../components/AppLayout'
import { Typography, Tag, Table, Card } from 'antd'
const { Title, Text } = Typography


class Index extends React.Component {
  render() {
    return (
      <AppLayout>
                 <Content style={{ marginTop: '10px', margin: '0 auto', maxWidth: 850, paddingBottom: 100 }}>
                       <Title style={{margin: '100px 0', maxWidth: 550, letterSpacing: '-2px', fontSize: 50, lineHeight: 1}}>Welcome to the Helium Blockchain Explorer</Title>

            <BlocksList />
          </Content>
      </AppLayout>
    )
  }
}

export default Index
