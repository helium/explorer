import React from 'react'
import { Typography } from 'antd'
const { Title } = Typography

const TopBanner = ({ children }) => (
  <div style={{ backgroundColor: '#101725' }}>
    <div style={{ padding: '40px 0px 40px 50px' }}>
      <Title
        style={{
          margin: '0px 0 40px',
          maxWidth: 550,
          letterSpacing: '-2px',
          fontSize: 38,
          lineHeight: 1,
          color: 'white',
          fontWeight: 300,
        }}
      >
        {children}
      </Title>
    </div>
  </div>
)

export default TopBanner
