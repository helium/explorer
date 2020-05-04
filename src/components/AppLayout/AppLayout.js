import React from 'react'
import { Layout, Typography } from 'antd'
import NavHeader from './NavHeader'
import Typekit from 'react-typekit'

const { Content, Footer } = Layout
const { Text } = Typography

const layoutStyle = {
  fontFamily: 'soleil, sans-serif',
  fontStyle: 'normal',
  minHeight: '100vh',
}

const AppLayout = ({ children }) => (
  <Layout style={layoutStyle}>
    <Typekit kitId="bum5vme" />

    <NavHeader />

    <Content style={{ padding: '0px' }}>{children}</Content>

    <Footer style={{ textAlign: 'center' }}>
      <Text style={{ color: '#8182AB' }}>©2020 Helium Systems, Inc.</Text>
    </Footer>
  </Layout>
)

export default AppLayout
