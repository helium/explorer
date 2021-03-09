import React from 'react'
import { Row, Col } from 'antd'

const Content = ({ children, style = {}, classes }) => (
  <Row justify="center" style={style} className={`${classes}`}>
    <Col style={{ width: '100%' }}>{children}</Col>
  </Row>
)

export default Content
