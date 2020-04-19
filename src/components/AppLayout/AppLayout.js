import React from 'react'
import { Layout, Typography, Row, Col } from 'antd'
import SearchBar from '../SearchBar'
import NavHeader from './NavHeader'

const { Content, Footer } = Layout
const { Text } = Typography

const AppLayout = ({ children }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <NavHeader />

    <Content style={{ padding: '50px' }}>
      <Row gutter={8}>
        <Col xs={12} offset={6}>
          <SearchBar />
        </Col>
      </Row>

      {children}
    </Content>

    <Footer style={{ textAlign: 'center' }}>
      <Text>©2020 Helium Systems, Inc.</Text>
    </Footer>
  </Layout>
)

export default AppLayout
