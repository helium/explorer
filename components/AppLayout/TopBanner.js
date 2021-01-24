import React from 'react'
import { Row, Typography } from 'antd'
import { Content } from '../../components/AppLayout'
import useResponsive from './useResponsive'
const { Title } = Typography

const TopBanner = ({ title, icon, contain }) => {
  const { isMobile } = useResponsive()

  return (
    <Content
      style={{
        backgroundColor: '#101725',
        padding: isMobile ? '30px 0 30px 20px' : '60px 0px 60px 50px',
      }}
    >
      <div style={contain ? { margin: '0 auto', maxWidth: 850 + 40 } : {}}>
        <Row align="middle">
          {icon && <img src={icon} style={{ marginRight: 10, width: 50 }} />}
          <Title
            style={{
              margin: 0,
              letterSpacing: '-2px',
              fontSize: 38,
              lineHeight: 1,
              color: 'white',
              fontWeight: 500,
            }}
          >
            {title}
          </Title>
        </Row>
      </div>
    </Content>
  )
}

export default TopBanner
