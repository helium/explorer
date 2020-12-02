import React from 'react'
import { Row, Button } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'

const LoadMoreButton = ({ onClick }) => (
  <Row style={{ justifyContent: 'center', paddingTop: 12, marginBottom: 12 }}>
    <Button
      size="large"
      type="default"
      icon={<ArrowDownOutlined />}
      onClick={onClick}
      style={{ backgroundColor: '#5850EB', color: 'white', borderRadius: 6 }}
    >
      Load More
    </Button>
  </Row>
)

export default LoadMoreButton
