import React from 'react'
import { Layout, Typography } from 'antd'
import SearchBar from '../SearchBar'
import NavHeader from './NavHeader'

const { Content, Footer } = Layout
const { Text } = Typography

const AppLayout = ({ children }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <NavHeader />

    <Content style={{ padding: '50px 10px' }}>
      <SearchBar />

      {children}
    </Content>

    <Footer style={{ textAlign: 'center' }}>
      <Text>©2020 Helium Systems, Inc.</Text>
    </Footer>
  </Layout>
)

export default AppLayout
