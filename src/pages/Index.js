import React from 'react'
import { Row, Col } from 'antd'
import BlocksList from '../components/BlocksList'
import AppLayout from '../components/AppLayout'

class Index extends React.Component {
  render() {
    return (
      <AppLayout>
        <Row justify="center" gutter={8} style={{ marginTop: 50 }}>
          <Col>
            <BlocksList />
          </Col>
        </Row>
      </AppLayout>
    )
  }
}

export default Index
