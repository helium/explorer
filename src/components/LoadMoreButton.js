import React from 'react'
import { Row, Button } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'

const LoadMoreButton = ({ onClick }) => (
  <Row style={{ justifyContent: 'center', paddingTop: 12 }}>
    <Button
      size="large"
      type="default"
      icon={<ArrowDownOutlined />}
      onClick={onClick}
    >
      Load More
    </Button>
  </Row>
)

export default LoadMoreButton
