import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import AppLayout from '../components/AppLayout'

class Index extends React.Component {
  render() {
    return (
      <AppLayout>
        <Row gutter={8} style={{ marginTop: 50 }}>
          <Col xs={16} offset={4}>
            <BlocksList />
          </Col>
        </Row>
      </AppLayout>
    )
  }
}

export default Index
