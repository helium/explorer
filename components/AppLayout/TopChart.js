import React from 'react'
import { Row, Col, Typography, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import useResponsive from './useResponsive'
const { Title, Text } = Typography

const TopChart = ({ title, subtitle, icon, tooltip, chart, radius }) => {
  const { isMobile } = useResponsive()

  return (
    <div style={{ backgroundColor: '#161E2E', borderRadius: radius ? 10 : 0 }}>
      <div
        style={{ padding: isMobile ? '20px 20px 0 20px' : '40px 40px 0 40px' }}
      >
        <Row justify="space-between">
          <Row justify="middle" gutter={[0, 16]}>
            {icon && <img src={icon} style={{ marginRight: 4 }} />}
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              {title}
            </Title>
          </Row>
          {tooltip && (
            <div>
              <Tooltip title={tooltip}>
                <span style={{ color: '#fff' }}>
                  <InfoCircleOutlined />
                </span>
              </Tooltip>
            </div>
          )}
        </Row>
        <Text style={{ color: '#717E98' }}>{subtitle}</Text>
      </div>
      {chart}
    </div>
  )
}

export default TopChart
