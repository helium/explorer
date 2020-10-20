import React from 'react'
import { Row, Col } from 'antd'

const Content = ({ children, style = {} }) => (
  <Row justify="center" style={style}>
    <Col style={{ width: '100%' }}>{children}</Col>
  </Row>
)

export default Content
