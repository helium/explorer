import React from 'react'
import { Row, Col, Typography } from 'antd'
import useResponsive from './useResponsive'
const { Title, Text } = Typography

const TopChart = ({ title, subtitle, icon, chart }) => {
  const { isMobile } = useResponsive()

  return (
    <div style={{ backgroundColor: '#161E2E' }}>
      <div style={{ padding: isMobile ? '20px 0 0 20px' : '40px 0 0 40px' }}>
        <Row justify="middle" gutter={[0, 16]}>
          {icon && <img src={icon} style={{ marginRight: 4 }} />}
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            {title}
          </Title>
        </Row>
        <Text style={{ color: '#717E98' }}>{subtitle}</Text>
      </div>
      {chart}
    </div>
  )
}

export default TopChart
